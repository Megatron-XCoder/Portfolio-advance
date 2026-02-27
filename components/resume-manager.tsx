"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Download, Trash2, AlertCircle, CheckCircle, Eye, X, FileText } from "lucide-react"

export interface Resume {
  _id: string
  title: string
  filename: string
  uploadedAt: string
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [resumeTitle, setResumeTitle] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/resume")
      if (res.ok) {
        const data = await res.json()
        setResumes(data)
      } else {
        setError("Failed to fetch resumes")
      }
    } catch (err) {
      console.error("Error checking resumes:", err)
      setError("Failed to fetch resumes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
      setError("Please select a file")
      return
    }
    if (!resumeTitle.trim()) {
      setError("Please enter a title for the resume")
      return
    }

    const file = fileInputRef.current.files[0]
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit")
      return
    }

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", resumeTitle.trim())

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to upload resume")
      }

      const data = await res.json()
      setResumes([{ _id: data.id, title: data.title, filename: data.filename, uploadedAt: new Date().toISOString() }, ...resumes])
      setSuccess("Resume uploaded successfully")
      setResumeTitle("")

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Error uploading resume:", err)
      setError(err instanceof Error ? err.message : "Failed to upload resume")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      setDeletingId(id)
      setError(null)
      setSuccess(null)

      const res = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete resume")
      }

      setResumes(resumes.filter((r) => r._id !== id))
      setSuccess("Resume deleted successfully")
    } catch (err) {
      console.error("Error deleting resume:", err)
      setError(err instanceof Error ? err.message : "Failed to delete resume")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {/* Preview Modal */}
      {previewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewId(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
              <span className="text-sm font-medium text-muted-foreground">Resume Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setPreviewId(null)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                <X size={16} />
              </Button>
            </div>
            <iframe
              src={`/api/resume/${previewId}`}
              className="w-full h-[80vh]"
              title="Resume Preview"
            />
          </div>
        </div>
      )}

      <div className="space-y-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText size={18} className="text-primary" /> Manage Resumes
        </h3>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-primary/10 border border-primary/30 text-primary p-3 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Resume cards — responsive grid */}
            {resumes.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {resumes.map((resume) => (
                  <div key={resume._id} className="bg-secondary/50 border border-border/50 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{resume.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{resume.filename}</p>
                      </div>
                      {/* Actions — stacked on mobile, row on desktop */}
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setPreviewId(resume._id)}>
                          <Eye size={13} /> View
                        </Button>
                        <a href={`/api/resume/${resume._id}?download=1`} download>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <Download size={13} /> Download
                          </Button>
                        </a>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleDelete(resume._id, resume.title)}
                          disabled={deletingId === resume._id}
                        >
                          {deletingId === resume._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary/30 p-6 rounded-xl text-center border border-dashed border-border/60">
                <FileText size={28} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No resumes uploaded yet</p>
              </div>
            )}

            {/* Upload form */}
            <form onSubmit={handleUpload} className="space-y-4 pt-4 border-t border-border/50">
              <p className="text-sm font-semibold">Upload New Resume</p>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Resume Title</label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer Resume"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer text-sm ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Select PDF file"}
                </label>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={uploading}>
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Uploading..." : "Upload Resume"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Only PDF files up to 5MB are supported</p>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Download, Trash2, AlertCircle, CheckCircle } from "lucide-react"

export function ResumeManager() {
  const [resumeExists, setResumeExists] = useState(false)
  const [resumeFilename, setResumeFilename] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const checkResumeExists = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/resume", {
        method: "HEAD",
      })

      if (res.ok) {
        setResumeExists(true)
        // Try to get the filename from Content-Disposition header
        const contentDisposition = res.headers.get("Content-Disposition")
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch && filenameMatch[1]) {
            setResumeFilename(filenameMatch[1])
          }
        }
      } else {
        setResumeExists(false)
        setResumeFilename(null)
      }

      setError(null)
    } catch (err) {
      console.error("Error checking resume:", err)
      setError("Failed to check if resume exists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkResumeExists()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }

    // Validate file size (5MB limit)
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

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to upload resume")
      }

      const data = await res.json()
      setResumeExists(true)
      setResumeFilename(data.filename)
      setSuccess("Resume uploaded successfully")

      // Reset file input
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

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/resume", {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete resume")
      }

      setResumeExists(false)
      setResumeFilename(null)
      setSuccess("Resume deleted successfully")
    } catch (err) {
      console.error("Error deleting resume:", err)
      setError(err instanceof Error ? err.message : "Failed to delete resume")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manage Resume</h3>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-primary/10 border border-primary/30 text-primary p-3 rounded-md flex items-center gap-2">
          <CheckCircle size={16} />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {resumeExists ? (
            <div className="bg-secondary p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-muted-foreground">{resumeFilename || "resume.pdf"}</p>
                </div>
                <div className="flex gap-2">
                  <a href="/api/resume" download>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </a>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : (
                      <Trash2 size={16} className="mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/50 p-4 rounded-md text-center">
              <p className="text-muted-foreground">No resume uploaded yet</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Upload New Resume</p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                ref={fileInputRef}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-dashed border-border hover:border-primary transition-colors cursor-pointer ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span>{uploading ? "Uploading..." : "Select PDF file"}</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Only PDF files up to 5MB are supported</p>
          </div>
        </div>
      )}
    </div>
  )
}

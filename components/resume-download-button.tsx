"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2, X, FileText } from "lucide-react"

export interface Resume {
  _id: string
  title: string
  filename: string
}

export function ResumeDownloadButton() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/resume")
        if (res.ok) {
          const data = await res.json()
          setResumes(data)
        }
      } catch (err) {
        console.error("Error fetching resumes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  if (loading) {
    return (
      <Button disabled className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
        <Loader2 size={16} className="animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  if (resumes.length === 0) {
    return null
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

      <div className="flex flex-col gap-3 w-full">
        {resumes.map((resume) => (
          <div key={resume._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border border-border/50 rounded-lg bg-card/50">
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={16} className="text-primary shrink-0" />
              <span className="font-medium text-sm text-foreground truncate">
                {resume.title}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                className="bg-secondary hover:bg-secondary/80 text-foreground border border-border gap-1.5 text-xs h-8"
                onClick={() => setPreviewId(resume._id)}
              >
                <Eye size={14} /> Preview
              </Button>
              <a href={`/api/resume/${resume._id}?download=1`} download>
                <Button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 gap-1.5 text-xs h-8">
                  <Download size={14} /> Download
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

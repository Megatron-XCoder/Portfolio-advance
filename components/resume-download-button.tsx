"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

export function ResumeDownloadButton() {
  const [resumeExists, setResumeExists] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkResumeExists = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/resume", {
          method: "HEAD",
        })

        setResumeExists(res.ok)
      } catch (err) {
        console.error("Error checking resume:", err)
        setResumeExists(false)
      } finally {
        setLoading(false)
      }
    }

    checkResumeExists()
  }, [])

  if (loading) {
    return (
      <Button disabled className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
        <Loader2 size={16} className="animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  if (!resumeExists) {
    return null
  }

  return (
    <a href="/api/resume" download>
      <Button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
        <Download size={16} className="mr-2" />
        Download Resume
      </Button>
    </a>
  )
}

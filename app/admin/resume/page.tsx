"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ResumeManager } from "@/components/resume-manager"
import { useAuth } from "@/lib/auth-context"

export default function AdminResumePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Admin
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Resume Management</h1>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">resume_manager.sh</div>
        </div>
        <div className="terminal-content p-4">
          <ResumeManager />
        </div>
      </div>
    </div>
  )
}

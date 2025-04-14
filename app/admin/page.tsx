"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, FolderPlus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth()
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/projects/new">
          <div className="terminal-window h-full card-hover">
            <div className="terminal-header">
              <div className="terminal-button terminal-button-red"></div>
              <div className="terminal-button terminal-button-yellow"></div>
              <div className="terminal-button terminal-button-green"></div>
              <div className="terminal-title">projects.sh</div>
            </div>
            <div className="terminal-content p-6 flex flex-col items-center justify-center text-center">
              <FolderPlus size={48} className="text-primary mb-4" />
              <h2 className="text-xl font-bold mb-2">Project Management</h2>
              <p className="text-muted-foreground">Add, edit, or delete projects and manage categories</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/resume">
          <div className="terminal-window h-full card-hover">
            <div className="terminal-header">
              <div className="terminal-button terminal-button-red"></div>
              <div className="terminal-button terminal-button-yellow"></div>
              <div className="terminal-button terminal-button-green"></div>
              <div className="terminal-title">resume.sh</div>
            </div>
            <div className="terminal-content p-6 flex flex-col items-center justify-center text-center">
              <FileText size={48} className="text-primary mb-4" />
              <h2 className="text-xl font-bold mb-2">Resume Management</h2>
              <p className="text-muted-foreground">Upload, update, or delete your resume</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

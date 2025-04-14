"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectEditor } from "@/components/project-editor"
import { useAuth } from "@/lib/auth-context"

export default function NewProjectPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/projects")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <ProjectEditor />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProjectEditor } from "@/components/project-editor"
import type { Project } from "@/lib/models/project"
import { useAuth } from "@/lib/auth-context"

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/projects")
      return
    }

    const fetchProject = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/projects/${id}`)

        if (!res.ok) {
          throw new Error("Failed to fetch project")
        }

        const data = await res.json()
        setProject(data)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError("Failed to load project. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id, isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading project...</p>
      </div>
    )
  }

  if (error) {
    return <div className="bg-destructive/20 border border-destructive text-white p-4 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      {project && <ProjectEditor project={project} isEdit={true} />}
    </div>
  )
}

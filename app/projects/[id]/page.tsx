"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/models/project"
import { useAuth } from "@/lib/auth-context"

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/projects/${id}`)

        if (!res.ok) {
          if (res.status === 404) {
            notFound()
          }
          throw new Error("Failed to fetch project")
        }

        const data = await res.json()
        setProject(data)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError(`${err instanceof Error ? err.message : "Failed to load project"}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  const handleDelete = async () => {
    if (!project?._id) return

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      router.push("/projects")
      router.refresh()
    } catch (err) {
      console.error("Error deleting project:", err)
      alert("Failed to delete project. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
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
    return (
      <div className="space-y-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to projects
        </Link>

        <div className="bg-destructive/20 border border-destructive text-white p-6 rounded-md text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to projects
        </Link>

        {isAuthenticated && (
          <div className="flex gap-2">
            <Link href={`/projects/edit/${project._id}`}>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </Link>

            {!showDeleteConfirm ? (
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat {id}.json
          </p>
          <div className="mb-4">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 rounded-md overflow-hidden">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      <div className="flex flex-wrap gap-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors"
          >
            <Github size={16} /> View on GitHub
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
          >
            <ExternalLink size={16} /> Live Demo
          </a>
        )}
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.longDescription || project.description}</p>
      </div>
    </div>
  )
}

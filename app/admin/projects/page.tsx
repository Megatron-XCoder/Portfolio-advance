"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FolderKanban, Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/models/project"
import { toast } from "sonner"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        setProjects(await res.json())
      }
    } catch (e) {
      toast.error("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Project deleted successfully")
        setProjects(projects.filter((p) => p._id !== id))
      } else {
        toast.error("Failed to delete project")
      }
    } catch (e) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="text-primary" />
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            <Loader2 className="animate-spin mr-2" /> Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <FolderKanban size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-1 mb-4">You haven't added any projects to your portfolio yet.</p>
            <Link href="/projects/new">
              <Button variant="outline">Create your first project</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project._id?.toString() || project.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{project.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {project.category || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">Featured</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/projects/${project.id || project._id}`}>
                          <Button variant="ghost" size="icon" title="View">
                            <ExternalLink size={16} className="text-muted-foreground" />
                          </Button>
                        </Link>
                        <Link href={`/projects/edit/${project.id || project._id}`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit size={16} className="text-blue-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDelete(project._id as string)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

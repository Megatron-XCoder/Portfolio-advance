"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw, LogIn, LogOut } from "lucide-react"
import type { Project } from "@/lib/models/project"
import type { Category } from "@/lib/models/category"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/projects")

      if (!res.ok) {
        throw new Error("Failed to fetch projects")
      }

      const data = await res.json()
      setProjects(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError("Failed to load projects. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const res = await fetch("/api/categories")

      if (!res.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  const filteredProjects =
      activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
      <div className="space-y-8">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">projects.sh</div>
          </div>
          <div className="terminal-content">
            <div className="flex justify-between items-center mb-4">
              <p>
                <span className="text-primary">$</span> Displaying projects directory. Select category to filter results.
              </p>
              <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      fetchProjects()
                      fetchCategories()
                    }}
                    disabled={loading}
                >
                  <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {isAuthenticated ? (
                    <>
                      <Link href="/projects/new">
                        <Button size="sm">
                          <PlusCircle size={16} className="mr-2" />
                          New Project
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={logout}>
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                      <LogIn size={16} className="mr-2" />
                      Admin Login
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <div className="bg-destructive/20 border border-destructive text-white p-4 rounded-md">{error}</div>}

        <div className="flex flex-wrap gap-2">
          <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            All Projects
          </button>

          {loadingCategories ? (
              <div className="px-3 py-1 text-sm rounded-md bg-secondary/50 text-secondary-foreground">Loading...</div>
          ) : (
              categories.map((category) => (
                  <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          activeFilter === category.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {category.name}
                  </button>
              ))
          )}
        </div>

        {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="mt-2 text-muted-foreground">Loading projects...</p>
            </div>
        ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects found.</p>
              {isAuthenticated && (
                  <Link href="/projects/new" className="mt-4 inline-block">
                    <Button>
                      <PlusCircle size={16} className="mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
              )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                  <ProjectCard
                      key={project._id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      image={project.image}
                      technologies={project.technologies}
                      isAuthenticated={isAuthenticated}
                      projectId={project._id}
                      onProjectDeleted={fetchProjects}
                  />
              ))}
            </div>
        )}

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
  )
}

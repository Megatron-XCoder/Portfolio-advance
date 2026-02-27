"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Edit, Trash2, AlertTriangle, Calendar, Layers, Sparkles, Code2, Globe, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/models/project"
import { useAuth } from "@/lib/auth-context"
import { SectionReveal } from "@/components/section-reveal"

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
          if (res.status === 404) notFound()
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
    if (id) fetchProject()
  }, [id])

  const handleDelete = async () => {
    if (!project?._id) return
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/projects/${project._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete project")
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/5 animate-pulse" />
        </div>
        <p className="mt-6 text-muted-foreground font-mono text-sm tracking-[0.3em] uppercase">Initializing...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Error Loading Project</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link href="/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} /> Back to Projects
          </Button>
        </Link>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="pb-20">
      {/* =============== BREADCRUMB BAR =============== */}
      <SectionReveal direction="up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>

          {isAuthenticated && (
            <div className="flex gap-2">
              <Link href={`/projects/edit/${project._id}`}>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30">
                  <Edit size={14} /> Edit
                </Button>
              </Link>
              {!showDeleteConfirm ? (
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)} className="h-9 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60">
                  <Trash2 size={14} /> Delete
                </Button>
              ) : (
                <div className="flex gap-1.5 items-center bg-destructive/10 border border-destructive/30 rounded-lg px-3">
                  <span className="text-xs text-destructive font-medium">Confirm?</span>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "..." : "Yes"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowDeleteConfirm(false)}>No</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionReveal>

      {/* =============== HERO SECTION =============== */}
      <SectionReveal direction="up" delay={50}>
        <div className="relative rounded-2xl overflow-hidden mb-8 sm:mb-12 group">
          {/* Background Image — tall on mobile, cinematic on desktop */}
          <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7]">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              priority
            />
            {/* Multi-layer gradient overlay — stronger on mobile so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 sm:via-background/70 to-background/30 sm:to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          </div>

          {/* Hero Content — flex-end so content anchors to the bottom */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12">
            <div className="max-w-4xl space-y-3 sm:space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/25 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  <Code2 size={11} /> {project.category}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles size={11} /> Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] glitch" data-text={project.title}>
                {project.title}
              </h1>

              {/* Short description */}
              <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-3">
                {project.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <Button className="h-9 sm:h-11 px-4 sm:px-6 text-sm sm:text-base bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-300 gap-2 rounded-xl">
                      <Globe size={15} /> Live Demo
                    </Button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="h-9 sm:h-11 px-4 sm:px-6 text-sm sm:text-base bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 gap-2 rounded-xl">
                      <Github size={15} /> View Source
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* =============== CONTENT GRID =============== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* LEFT: Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview Card */}
          <SectionReveal direction="up" delay={100}>
            <div className="relative p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Layers size={18} className="text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Project Overview</h2>
                </div>
                <div className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                  {project.longDescription || project.description}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Terminal */}
          <SectionReveal direction="up" delay={200}>
            <div className="rounded-2xl border border-border/40 overflow-hidden shadow-2xl shadow-black/20">
              {/* Terminal Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-[#1a1a1a] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/40 font-mono">project_manifest.json — terminal</span>
                </div>
              </div>
              {/* Terminal Body */}
              <div className="bg-[#0d0d0d] p-5 sm:p-6 font-mono text-sm leading-relaxed">
                <div className="mb-4">
                  <span className="text-green-400">➜</span>{" "}
                  <span className="text-blue-400">~/projects/{id}</span>{" "}
                  <span className="text-white/60">cat</span> manifest.json
                </div>
                <div className="text-white/80 pl-2 border-l-2 border-primary/30 ml-1">
                  <p><span className="text-purple-400">{"{"}</span></p>
                  <div className="pl-4 space-y-1">
                    <p><span className="text-cyan-300">&quot;name&quot;</span>: <span className="text-amber-300">&quot;{project.title}&quot;</span>,</p>
                    <p><span className="text-cyan-300">&quot;category&quot;</span>: <span className="text-amber-300">&quot;{project.category}&quot;</span>,</p>
                    <p><span className="text-cyan-300">&quot;status&quot;</span>: <span className="text-green-300">&quot;deployed&quot;</span>,</p>
                    <p><span className="text-cyan-300">&quot;stack&quot;</span>: [</p>
                    <div className="pl-4">
                      {project.technologies.map((tech, i) => (
                        <p key={i}>
                          <span className="text-amber-300">&quot;{tech}&quot;</span>
                          {i < project.technologies.length - 1 ? "," : ""}
                        </p>
                      ))}
                    </div>
                    <p>],</p>
                    <p><span className="text-cyan-300">&quot;links&quot;</span>: {"{"}</p>
                    <div className="pl-4">
                      <p><span className="text-cyan-300">&quot;demo&quot;</span>: <span className="text-amber-300">&quot;{project.demo || "N/A"}&quot;</span>,</p>
                      <p><span className="text-cyan-300">&quot;repo&quot;</span>: <span className="text-amber-300">&quot;{project.github || "N/A"}&quot;</span></p>
                    </div>
                    <p>{"}"}</p>
                  </div>
                  <p><span className="text-purple-400">{"}"}</span></p>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <span className="text-green-400">➜</span>{" "}
                  <span className="text-blue-400">~/projects/{id}</span>{" "}
                  <span className="w-2 h-4 bg-primary/80 inline-block animate-pulse" />
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="lg:col-span-4">
          <SectionReveal direction="up" delay={150}>
            <div className="sticky top-24 space-y-6">

              {/* Tech Stack Card */}
              <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Code2 size={14} className="text-primary" /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-secondary/80 text-secondary-foreground border border-border/50 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details Card */}
              <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" /> Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border/20">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
                      {project.category}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="flex items-center justify-between py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-medium text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Featured
                      </span>
                    </div>
                  )}
                  {project.createdAt && (
                    <div className="flex items-center justify-between py-2 border-b border-border/20">
                      <span className="text-sm text-muted-foreground">Added</span>
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary" />
                        {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Technologies</span>
                    <span className="text-sm font-medium">{project.technologies.length} used</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Globe size={14} className="text-primary" /> Quick Links
                </h3>
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:border-primary/40 transition-all duration-200 group">
                      <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ExternalLink size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">Live Demo</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{project.demo}</p>
                      </div>
                    </div>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary/80 hover:border-border transition-all duration-200 group">
                      <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Github size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Source Code</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{project.github}</p>
                      </div>
                    </div>
                  </a>
                )}
              </div>

            </div>
          </SectionReveal>
        </div>

      </div>
    </div>
  )
}

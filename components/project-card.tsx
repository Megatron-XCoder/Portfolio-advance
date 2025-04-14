"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  isAuthenticated?: boolean
  projectId?: string
  onProjectDeleted?: () => void
}

export function ProjectCard({
                              id,
                              title,
                              description,
                              image,
                              technologies,
                              isAuthenticated = false,
                              projectId,
                              onProjectDeleted,
                            }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!projectId) return

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      if (onProjectDeleted) {
        onProjectDeleted()
      }
    } catch (err) {
      console.error("Error deleting project:", err)
      alert("Failed to delete project. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
      <Link href={`/projects/${id}`}>
        <div className="card-hover bg-card rounded-md overflow-hidden h-full flex flex-col relative">
          {isAuthenticated && (
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Link href={`/projects/edit/${projectId}`} onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Edit size={14} />
                  </Button>
                </Link>
                {!showDeleteConfirm ? (
                    <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowDeleteConfirm(true)
                        }}
                    >
                      <Trash2 size={14} />
                    </Button>
                ) : (
                    <Button size="sm" variant="destructive" className="h-8" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "..." : "Confirm"}
                    </Button>
                )}
              </div>
          )}
          <div className="relative h-48">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-bold text-white glitch" data-text={title}>
                {title}
              </h3>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                {tech}
              </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
  )
}

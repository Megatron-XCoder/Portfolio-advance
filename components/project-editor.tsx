"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/lib/models/project"
import type { Category } from "@/lib/models/category"
import { Loader2, Save, X, Plus } from "lucide-react"
import { CategoryManager } from "@/components/category-manager"
import { projectSchema, type ProjectFormData } from "@/lib/schemas"
import { toast } from "sonner"

interface ProjectEditorProps {
  project?: Project
  isEdit?: boolean
}

export function ProjectEditor({ project, isEdit = false }: ProjectEditorProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [techInput, setTechInput] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      image: "/placeholder.svg?height=600&width=800",
      technologies: [],
      category: "",
      featured: false,
      github: "",
      demo: "",
    },
  })

  const technologies = watch("technologies") || []

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const res = await fetch("/api/categories")

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setCategories(data)

      if (data.length > 0 && !watch("category")) {
        setValue("category", data[0].id)
      }
    } catch (err) {
      toast.error("Error fetching categories")
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || "",
        description: project.description || "",
        longDescription: project.longDescription || "",
        image: project.image || "/placeholder.svg?height=600&width=800",
        technologies: project.technologies || [],
        category: project.category || "",
        featured: project.featured || false,
        github: project.github || "",
        demo: project.demo || "",
      })
    }
  }, [project, reset])

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue("technologies", [...technologies, techInput.trim()], { shouldValidate: true })
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setValue(
      "technologies",
      technologies.filter((t) => t !== tech),
      { shouldValidate: true }
    )
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const url = isEdit ? `/api/projects/${project?._id}` : "/api/projects"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save project")

      const savedData = await response.json()
      toast.success(isEdit ? "Project updated successfully!" : "Project created successfully!")
      router.push(`/projects/${savedData.id || savedData._id}`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to save project. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_editor.sh</div>
        </div>
        <div className="terminal-content p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">title:</span>
              </label>
              <Input
                {...register("title")}
                placeholder="Enter project title"
                className="bg-background border-border"
              />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">description:</span>
              </label>
              <Textarea
                {...register("description")}
                placeholder="Enter a short description"
                className="bg-background border-border"
                rows={2}
              />
              {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">long_description:</span>
              </label>
              <Textarea
                {...register("longDescription")}
                placeholder="Enter a detailed description"
                className="bg-background border-border"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">image_url:</span>
              </label>
              <Input
                {...register("image")}
                placeholder="Enter image URL"
                className="bg-background border-border"
              />
              {errors.image && <p className="text-destructive text-xs mt-1">{errors.image.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm">
                  <span className="text-primary">category:</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryManager(!showCategoryManager)}
                  className="h-7 text-xs"
                >
                  {showCategoryManager ? "Hide Manager" : "Manage Categories"}
                </Button>
              </div>

              {showCategoryManager && (
                <div className="mb-4 p-4 border border-border rounded-md bg-background/50">
                  <CategoryManager />
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCategoryManager(false)
                        fetchCategories()
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}

              {loadingCategories ? (
                <div className="flex items-center justify-center h-10 bg-background border border-border rounded-md">
                  <Loader2 size={16} className="animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center h-10 bg-background border border-border rounded-md text-muted-foreground">
                    No categories available
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCategoryManager(true)}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Create Category
                  </Button>
                </div>
              ) : (
                <select
                  {...register("category")}
                  className="w-full bg-background border-border rounded-md p-2"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">technologies:</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology"
                  className="bg-background border-border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTech()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTech} variant="outline">
                  Add
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-muted-foreground hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.technologies && <p className="text-destructive text-xs mt-1">{errors.technologies.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">github_url:</span>
              </label>
              <Input
                {...register("github")}
                placeholder="Enter GitHub repository URL"
                className="bg-background border-border"
              />
              {errors.github && <p className="text-destructive text-xs mt-1">{errors.github.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">demo_url:</span>
              </label>
              <Input
                {...register("demo")}
                placeholder="Enter live demo URL"
                className="bg-background border-border"
              />
              {errors.demo && <p className="text-destructive text-xs mt-1">{errors.demo.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="rounded border-border bg-background"
              />
              <label htmlFor="featured" className="text-sm">
                <span className="text-primary">featured_on_homepage</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}


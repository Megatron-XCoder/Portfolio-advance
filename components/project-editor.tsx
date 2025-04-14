"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/lib/models/project"
import { Loader2, Save, X } from "lucide-react"

interface ProjectEditorProps {
    project?: Project
    isEdit?: boolean
}

export function ProjectEditor({ project, isEdit = false }: ProjectEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Project>>({
        title: "",
        description: "",
        longDescription: "",
        image: "/placeholder.svg?height=600&width=800",
        technologies: [],
        category: "web",
        featured: false,
        github: "",
        demo: "",
    })
    const [techInput, setTechInput] = useState("")

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || "",
                description: project.description || "",
                longDescription: project.longDescription || "",
                image: project.image || "/placeholder.svg?height=600&width=800",
                technologies: project.technologies || [],
                category: project.category || "web",
                featured: project.featured || false,
                github: project.github || "",
                demo: project.demo || "",
            })
        }
    }, [project])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleAddTech = () => {
        if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                technologies: [...(prev.technologies || []), techInput.trim()],
            }))
            setTechInput("")
        }
    }

    const handleRemoveTech = (tech: string) => {
        setFormData((prev) => ({
            ...prev,
            technologies: prev.technologies?.filter((t) => t !== tech),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEdit ? `/api/projects/${project?._id}` : "/api/projects"
            const method = isEdit ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Failed to save project")
            }

            const data = await response.json()
            router.push(`/projects/${data.id}`)
            router.refresh()
        } catch (error) {
            console.error("Error saving project:", error)
            alert("Failed to save project. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { id: "web", name: "Web Development" },
        { id: "design", name: "Design" },
        { id: "app", name: "App Development" },
        { id: "marketing", name: "Marketing" },
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                            <label htmlFor="title" className="block text-sm mb-1">
                                <span className="text-primary">title:</span>
                            </label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter project title"
                                className="bg-background border-border"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm mb-1">
                                <span className="text-primary">description:</span>
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter a short description"
                                className="bg-background border-border"
                                rows={2}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="longDescription" className="block text-sm mb-1">
                                <span className="text-primary">long_description:</span>
                            </label>
                            <Textarea
                                id="longDescription"
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleChange}
                                placeholder="Enter a detailed description"
                                className="bg-background border-border"
                                rows={5}
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm mb-1">
                                <span className="text-primary">image_url:</span>
                            </label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                                className="bg-background border-border"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm mb-1">
                                <span className="text-primary">category:</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-background border-border rounded-md p-2"
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="technologies" className="block text-sm mb-1">
                                <span className="text-primary">technologies:</span>
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="technologies"
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
                            {formData.technologies && formData.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.technologies.map((tech) => (
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
                        </div>

                        <div>
                            <label htmlFor="github" className="block text-sm mb-1">
                                <span className="text-primary">github_url:</span>
                            </label>
                            <Input
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="Enter GitHub repository URL"
                                className="bg-background border-border"
                            />
                        </div>

                        <div>
                            <label htmlFor="demo" className="block text-sm mb-1">
                                <span className="text-primary">demo_url:</span>
                            </label>
                            <Input
                                id="demo"
                                name="demo"
                                value={formData.demo}
                                onChange={handleChange}
                                placeholder="Enter live demo URL"
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleCheckboxChange}
                                className="rounded border-border bg-background"
                            />
                            <label htmlFor="featured" className="text-sm">
                                <span className="text-primary">featured_on_homepage</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
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

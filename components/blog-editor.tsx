"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/lib/models/blog"
import { Loader2, Save, X } from "lucide-react"
import { TipTapEditor } from "./tiptap-editor"

interface BlogEditorProps {
  blogPost?: BlogPost
  isEdit?: boolean
}

export function BlogEditor({ blogPost, isEdit = false }: BlogEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    content: "",
    excerpt: "",
    author: "Sanjeev Kumar Das",
    tags: [],
    published: false,
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title || "",
        content: blogPost.content || "",
        excerpt: blogPost.excerpt || "",
        author: blogPost.author || "Sanjeev Kumar Das",
        tags: blogPost.tags || [],
        published: blogPost.published || false,
        coverImage: blogPost.coverImage || "",
      })
    }
  }, [blogPost])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/blogs/${blogPost?._id}` : "/api/blogs"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save blog post")
      }

      const data = await response.json()
      router.push(`/blog/${data.slug || data._id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Failed to save blog post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">blog_editor.sh</div>
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
                    placeholder="Enter blog title"
                    className="bg-background border-border"
                    required
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm mb-1">
                  <span className="text-primary">excerpt:</span>
                </label>
                <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Enter a short excerpt"
                    className="bg-background border-border"
                    rows={2}
                    required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm mb-1">
                  <span className="text-primary">content:</span>
                </label>
                <TipTapEditor value={formData.content || ""} onChange={handleContentChange} />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm mb-1">
                  <span className="text-primary">cover_image_url:</span>
                </label>
                <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage || ""}
                    onChange={handleChange}
                    placeholder="Enter cover image URL"
                    className="bg-background border-border"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm mb-1">
                  <span className="text-primary">tags:</span>
                </label>
                <div className="flex gap-2">
                  <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      className="bg-background border-border"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                          <div
                              key={tag}
                              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                          >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-muted-foreground hover:text-white"
                            >
                              <X size={12} />
                            </button>
                          </div>
                      ))}
                    </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="rounded border-border bg-background"
                />
                <label htmlFor="published" className="text-sm">
                  <span className="text-primary">publish_now</span>
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
                        Save Post
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

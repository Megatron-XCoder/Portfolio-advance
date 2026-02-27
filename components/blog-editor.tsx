"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/lib/models/blog"
import { Loader2, Save, X } from "lucide-react"
import { TipTapEditor } from "./tiptap-editor"
import { blogSchema, type BlogFormData } from "@/lib/schemas"
import { toast } from "sonner"

interface BlogEditorProps {
  blogPost?: BlogPost
  isEdit?: boolean
}

export function BlogEditor({ blogPost, isEdit = false }: BlogEditorProps) {
  const router = useRouter()
  const [tagInput, setTagInput] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "Sanjeev Kumar Das",
      tags: [],
      published: false,
      coverImage: "",
    },
  })

  const tags = watch("tags") || []

  useEffect(() => {
    if (blogPost) {
      reset({
        title: blogPost.title || "",
        content: blogPost.content || "",
        excerpt: blogPost.excerpt || "",
        author: blogPost.author || "Sanjeev Kumar Das",
        tags: blogPost.tags || [],
        published: blogPost.published || false,
        coverImage: blogPost.coverImage || "",
      })
    }
  }, [blogPost, reset])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()], { shouldValidate: true })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    )
  }

  const onSubmit = async (data: BlogFormData) => {
    try {
      const url = isEdit ? `/api/blogs/${blogPost?._id}` : "/api/blogs"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save blog post")

      const savedData = await response.json()
      toast.success(isEdit ? "Blog updated successfully!" : "Blog created successfully!")
      router.push(`/blog/${savedData.slug || savedData._id}`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to save blog post. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <label className="block text-sm mb-1">
                <span className="text-primary">title:</span>
              </label>
              <Input
                {...register("title")}
                placeholder="Enter blog title"
                className="bg-background border-border"
              />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">excerpt:</span>
              </label>
              <Textarea
                {...register("excerpt")}
                placeholder="Enter a short excerpt"
                className="bg-background border-border"
                rows={2}
              />
              {errors.excerpt && <p className="text-destructive text-xs mt-1">{errors.excerpt.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">content:</span>
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TipTapEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.content && <p className="text-destructive text-xs mt-1">{errors.content.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">cover_image_url:</span>
              </label>
              <Input
                {...register("coverImage")}
                placeholder="Enter cover image URL"
                className="bg-background border-border"
              />
              {errors.coverImage && <p className="text-destructive text-xs mt-1">{errors.coverImage.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">
                <span className="text-primary">tags:</span>
              </label>
              <div className="flex gap-2">
                <Input
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
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
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
              {errors.tags && <p className="text-destructive text-xs mt-1">{errors.tags.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                className="rounded border-border bg-background"
              />
              <label htmlFor="published" className="text-sm">
                <span className="text-primary">publish_now</span>
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

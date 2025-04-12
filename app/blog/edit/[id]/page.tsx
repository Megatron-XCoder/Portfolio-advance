"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlogEditor } from "@/components/blog-editor"
import type { BlogPost } from "@/lib/models/blog"
import { useAuth } from "@/lib/auth-context"

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/blog")
      return
    }

    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${id}`)

        if (!res.ok) {
          throw new Error("Failed to fetch blog post")
        }

        const data = await res.json()
        setBlogPost(data)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError("Failed to load blog post. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlogPost()
    }
  }, [id, isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading blog post...</p>
      </div>
    )
  }

  if (error) {
    return <div className="bg-destructive/20 border border-destructive text-white p-4 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      {blogPost && <BlogEditor blogPost={blogPost} isEdit={true} />}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/models/blog"
import { useAuth } from "@/lib/auth-context"

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${id}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Blog post not found")
          }
          throw new Error("Failed to fetch blog post")
        }

        const data = await res.json()
        setPost(data)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError(`${err instanceof Error ? err.message : "Failed to load blog post"}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  const handleDelete = async () => {
    if (!post?._id) return

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/blogs/${post._id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete blog post")
      }

      router.push("/blog")
      router.refresh()
    } catch (err) {
      console.error("Error deleting blog post:", err)
      alert("Failed to delete blog post. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
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
    return (
      <div className="space-y-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <div className="bg-destructive/20 border border-destructive text-white p-6 rounded-md text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to blog
        </Link>

        {isAuthenticated && (
          <div className="flex gap-2">
            <Link href={`/blog/edit/${post._id}`}>
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

      <article>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 glitch" data-text={post.title}>
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{`${Math.ceil(post.content.length / 1000)} min read`}</span>
            </div>
          </div>
        </div>

        {post.coverImage && (
          <div className="relative h-80 mb-8 rounded-md overflow-hidden">
            <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">blog_content.md</div>
          </div>
          <div className="terminal-content p-4">
            <div
              className="prose prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-pre:bg-secondary prose-pre:text-secondary-foreground prose-code:bg-secondary prose-code:text-secondary-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

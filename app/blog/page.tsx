"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { BlogPost } from "@/lib/models/blog"
import { SectionReveal } from "@/components/section-reveal"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/blogs?published=true")
      if (!res.ok) throw new Error("Failed to fetch blog posts")
      setPosts(await res.json())
      setError(null)
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError("Failed to load blog posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  return (
    <div className="space-y-8">
      {/* Header Terminal */}
      <SectionReveal direction="up">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">blog_posts.sh</div>
          </div>
          <div className="terminal-content">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                <span className="text-primary">$</span> ls -la /articles
              </p>
              <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading} className="self-start sm:self-auto">
                <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </SectionReveal>

      {error && (
        <div className="bg-destructive/20 border border-destructive text-white p-4 rounded-md">{error}</div>
      )}

      {/* Blog grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <SectionReveal key={post._id} direction="up" delay={index * 80}>
              <BlogCard
                id={post.slug || post._id || ""}
                title={post.title}
                excerpt={post.excerpt}
                date={new Date(post.createdAt).toLocaleDateString()}
                readingTime={`${Math.ceil(post.content.length / 1000)} min read`}
              />
            </SectionReveal>
          ))}
        </div>
      )}
    </div>
  )
}

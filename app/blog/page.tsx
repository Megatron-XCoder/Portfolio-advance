"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw, LogIn, LogOut } from "lucide-react"
import type { BlogPost } from "@/lib/models/blog"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // If authenticated, fetch all posts, otherwise only published ones
      const url = isAuthenticated ? "/api/blogs" : "/api/blogs?published=true"
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Failed to fetch blog posts")
      }

      const data = await res.json()
      setPosts(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError("Failed to load blog posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [isAuthenticated])

  return (
    <div className="space-y-8">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">blog_posts.sh</div>
        </div>
        <div className="terminal-content">
          <div className="flex flex-col justify-between items-start mb-4">
            <p className={"pb-4"}>
              <span className="text-primary">$</span> ls -la /articles
            </p>
            <div className=" grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading}>
                <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              {isAuthenticated ? (
                <>
                  <Link href="/blog/new">
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      New Post
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

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No blog posts found.</p>
          {isAuthenticated && (
            <Link href="/blog/new" className="mt-4 inline-block">
              <Button>
                <PlusCircle size={16} className="mr-2" />
                Create Your First Post
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              id={post.slug || post._id || ""}
              title={post.title}
              excerpt={post.excerpt}
              date={new Date(post.createdAt).toLocaleDateString()}
              readingTime={`${Math.ceil(post.content.length / 1000)} min read`}
            />
          ))}
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}

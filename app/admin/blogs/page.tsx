"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/models/blog"
import { toast } from "sonner"

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs")
      if (res.ok) {
        setBlogs(await res.json())
      }
    } catch (e) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Blog deleted successfully")
        setBlogs(blogs.filter((b) => b._id !== id))
      } else {
        toast.error("Failed to delete blog")
      }
    } catch (e) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="text-primary" />
            Blogs
          </h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts</p>
        </div>
        <Link href="/blog/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Write Post
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            <Loader2 className="animate-spin mr-2" /> Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <FileText size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No blog posts found</h3>
            <p className="text-muted-foreground mt-1 mb-4">Start sharing your thoughts and knowledge.</p>
            <Link href="/blog/new">
              <Button variant="outline">Write your first post</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Post</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr key={blog._id?.toString() || blog.slug} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground truncate max-w-[200px] md:max-w-xs">{blog.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs mt-1">{blog.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {blog.published ? (
                        <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded">Published</span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${blog.slug || blog._id}`}>
                          <Button variant="ghost" size="icon" title="View">
                            <ExternalLink size={16} className="text-muted-foreground" />
                          </Button>
                        </Link>
                        <Link href={`/blog/edit/${blog.slug || blog._id}`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit size={16} className="text-blue-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDelete(blog._id as string)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BlogEditor } from "@/components/blog-editor"
import { useAuth } from "@/lib/auth-context"

export default function NewBlogPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/blog")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      <BlogEditor />
    </div>
  )
}

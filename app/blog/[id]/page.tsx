"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Trash2, AlertTriangle, Calendar, Clock, Share2, ChevronRight, BookOpen, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/models/blog"
import { useAuth } from "@/lib/auth-context"
import { SectionReveal } from "@/components/section-reveal"

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${id}`)
        if (!res.ok) {
          if (res.status === 404) notFound()
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
    if (id) fetchPost()
  }, [id])

  const handleDelete = async () => {
    if (!post?._id) return
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/blogs/${post._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete blog post")
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

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="mt-6 text-muted-foreground font-mono text-sm tracking-[0.3em] uppercase">Loading article...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} /> Back to Blog
          </Button>
        </Link>
      </div>
    )
  }

  if (!post) return null

  const readingTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="pb-24">
      {/* ============= BREADCRUMB + ADMIN ============= */}
      <SectionReveal direction="up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>

          {isAuthenticated && (
            <div className="flex gap-2">
              <Link href={`/blog/edit/${post._id}`}>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30">
                  <Edit size={14} /> Edit
                </Button>
              </Link>
              {!showDeleteConfirm ? (
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)} className="h-9 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60">
                  <Trash2 size={14} /> Delete
                </Button>
              ) : (
                <div className="flex gap-1.5 items-center bg-destructive/10 border border-destructive/30 rounded-lg px-3">
                  <span className="text-xs text-destructive font-medium">Confirm?</span>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "..." : "Yes"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowDeleteConfirm(false)}>No</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionReveal>

      {/* ============= HERO HEADER ============= */}
      <SectionReveal direction="up" delay={50}>
        <div className="relative rounded-2xl overflow-hidden mb-8 sm:mb-12">
          {/* Cover Image or Gradient Fallback — tall on mobile, cinematic on desktop */}
          {post.coverImage ? (
            <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] md:aspect-[2/1] lg:aspect-[21/9]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 sm:via-background/70 to-background/30 sm:to-background/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
            </div>
          ) : (
            <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] md:aspect-[2/1] lg:aspect-[21/9] bg-gradient-to-br from-primary/20 via-card to-purple-900/20">
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          )}

          {/* Title overlay — flex-end to anchor content to bottom */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              {/* Meta pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 bg-card/60 backdrop-blur-md border border-border/40 text-muted-foreground px-2.5 py-1 rounded-full text-[11px] sm:text-sm font-medium">
                  <Calendar size={13} className="text-primary" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-card/60 backdrop-blur-md border border-border/40 text-muted-foreground px-2.5 py-1 rounded-full text-[11px] sm:text-sm font-medium">
                  <Clock size={13} className="text-primary" />
                  {readingTime} min read
                </span>
                <span className="inline-flex items-center gap-1.5 bg-card/60 backdrop-blur-md border border-border/40 text-muted-foreground px-2.5 py-1 rounded-full text-[11px] sm:text-sm font-medium">
                  <BookOpen size={13} className="text-primary" />
                  Article
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-lg glitch" data-text={post.title}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ============= TAGS ============= */}
      {post.tags && post.tags.length > 0 && (
        <SectionReveal direction="up" delay={100}>
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Tag size={14} className="text-muted-foreground mr-1" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm px-3 py-1 rounded-full bg-secondary/60 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {/* ============= ARTICLE BODY ============= */}
      <SectionReveal direction="up" delay={200}>
        <div className="max-w-3xl mx-auto">
          {/* Decorative line */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <BookOpen size={16} className="text-muted-foreground" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Article content with rich prose styling */}
          <div
            className="
              prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/30
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[hsl(240,5%,72%)] prose-p:leading-[1.85] prose-p:mb-6
              prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:decoration-primary/30 prose-a:underline-offset-4 hover:prose-a:decoration-primary
              prose-strong:text-foreground prose-strong:font-bold
              prose-em:text-foreground/80
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-card/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-foreground/90 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:my-8
              prose-ul:text-[hsl(240,5%,72%)] prose-ol:text-[hsl(240,5%,72%)] prose-li:my-1.5 prose-li:leading-relaxed
              prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-border/30 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:my-8
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-img:rounded-xl prose-img:border prose-img:border-border/30 prose-img:shadow-2xl prose-img:my-10
              prose-hr:border-border/30 prose-hr:my-12
              prose-table:text-sm prose-th:text-foreground prose-th:font-semibold
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ============= FOOTER ============= */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">End of article</p>
                  <p className="text-xs text-muted-foreground">Thanks for reading!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="h-10 px-5 rounded-full bg-card/50 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all gap-2"
                >
                  <Share2 size={16} />
                  {copied ? "Copied!" : "Share"}
                </Button>
                <Link href="/blog">
                  <Button variant="outline" className="h-10 px-5 rounded-full bg-card/50 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all gap-2">
                    <ArrowLeft size={16} /> More Articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/models/blog"
import type { Project } from "@/lib/models/project"

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const roles = ["Software Engineer", "Full Stack Developer", "MERN Stack Developer", "UI/UX Designer"]
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentRole = roles[roleIndex]

      if (!isDeleting) {
        setTypedText(currentRole.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)

        if (charIndex >= currentRole.length) {
          setIsDeleting(true)
          setTypingSpeed(100)
          setTimeout(() => {
            setTypingSpeed(50)
          }, 1500)
        }
      } else {
        setTypedText(currentRole.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)

        if (charIndex <= 1) {
          setIsDeleting(false)
          setRoleIndex((roleIndex + 1) % roles.length)
          setTypingSpeed(150)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, roleIndex, roles, typingSpeed])

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoadingPosts(true)
        const res = await fetch("/api/blogs?published=true")

        if (!res.ok) {
          throw new Error("Failed to fetch blog posts")
        }

        const data = await res.json()
        setLatestPosts(data.slice(0, 1))
      } catch (err) {
        console.error("Error fetching blog posts:", err)
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchLatestPosts()
  }, [])

  const featuredProjects = [
    {
      id: "web-design",
      title: "Web Design Projects",
      description:
        "Creating visually appealing and user-friendly websites tailored to brand identities with modern design principles.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces and experiences that ensure websites and applications are both functional and enjoyable.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    },
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Building robust and scalable web applications using the latest technologies with high performance and security.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["MERN Stack", "JavaScript", "Node.js", "MongoDB"],
    },
  ]

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "ReactJS",
    "MongoDB",
    "Express",
    "Node.js",
    "Java",
    "Kotlin",
    "AWS",
    "Azure",
    "Figma",
    "Photoshop",
    "Illustrator",
  ]

  return (
    <div className="space-y-16">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Hi, I'm Sanjeev Kumar Das!</h1>
        <div className="h-8 mb-6">
          <h2 className="text-xl">
            I am a <span className="text-primary">{typedText}</span>
            <span className="terminal-cursor"></span>
          </h2>
        </div>

        <Terminal
          text="Innovative developer with strong expertise in Java, JavaScript, MERN Stack, Kotlin, Linux, Agile Methodology, Cloud Computing Technologies, and SDLC models. Passionate about DevOps with exceptional qualities."
          typingSpeed={200}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
            >
              Learn more about me <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Services</h2>
          <Link href="/projects" className="text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">system_specs.sh</div>
          </div>
          <div className="terminal-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <span className="text-white">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest from the Blog</h2>
          <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loadingPosts ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="mt-2 text-muted-foreground">Loading latest posts...</p>
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {latestPosts.map((post) => (
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
        ) : (
          <div className="text-center py-8 border border-border rounded-md">
            <p className="text-muted-foreground mb-4">No blog posts found.</p>
            <Link href="/blog/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your First Blog Post
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

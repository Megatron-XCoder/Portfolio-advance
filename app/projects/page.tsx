"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const projects = [
    {
      id: "web-design",
      title: "Web Design",
      description:
        "Creating visually appealing and user-friendly websites tailored to brand identities with modern design principles.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      category: "web",
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces and experiences that ensure websites and applications are both functional and enjoyable.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
      category: "design",
    },
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Building robust and scalable web applications using the latest technologies with high performance and security.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["MERN Stack", "JavaScript", "Node.js", "MongoDB"],
      category: "web",
    },
    {
      id: "seo-optimization",
      title: "SEO Optimization",
      description:
        "Improving website visibility on search engines through effective SEO strategies to increase organic traffic.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["SEO Tools", "Analytics", "Content Strategy"],
      category: "marketing",
    },
    {
      id: "mobile-app",
      title: "Mobile App Development",
      description: "Creating responsive and user-friendly mobile applications for Android and iOS platforms.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["React Native", "Kotlin", "Swift"],
      category: "app",
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Creating visual content to communicate messages through typography, color, and images.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Photoshop", "Illustrator", "InDesign"],
      category: "design",
    },
  ]

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Development" },
    { id: "design", name: "Design" },
    { id: "app", name: "App Development" },
    { id: "marketing", name: "Marketing" },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <div className="space-y-8">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">projects.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-4">
            <span className="text-primary">$</span> Displaying projects directory. Select category to filter results.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeFilter === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            technologies={project.technologies}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()

  // This would typically come from an API or database
  const projects = {
    "web-design": {
      title: "Web Design",
      description:
        "Creating visually appealing and user-friendly websites tailored to brand identities with modern design principles.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      category: "web",
      github: "https://github.com/sanjeevkd",
      demo: "https://web-design-demo.vercel.app",
      longDescription:
        "Our web design services focus on creating visually appealing and user-friendly websites that are tailored to your brand's identity. We use modern design principles to enhance user experience and engagement. Our approach combines aesthetics with functionality, ensuring that your website not only looks great but also performs well. We pay attention to details like typography, color schemes, and layout to create a cohesive and professional online presence. Our designs are responsive, ensuring they look great on all devices from desktops to smartphones.",
    },
    "ui-ux-design": {
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces and experiences that ensure websites and applications are both functional and enjoyable.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
      category: "design",
      github: "https://github.com/sanjeevkd",
      demo: "https://ui-ux-design-demo.vercel.app",
      longDescription:
        "Our UI/UX design services focus on creating intuitive interfaces and experiences that make your website or application both functional and enjoyable to use. We prioritize user-centered design to meet your audience's needs. Our process begins with research to understand your users, followed by wireframing and prototyping to test ideas before implementation. We create designs that guide users intuitively through your digital product, reducing friction and increasing satisfaction. Our goal is to create memorable experiences that keep users coming back.",
    },
    "web-development": {
      title: "Web Development",
      description:
        "Building robust and scalable web applications using the latest technologies with high performance and security.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["MERN Stack", "JavaScript", "Node.js", "MongoDB"],
      category: "web",
      github: "https://github.com/sanjeevkd",
      demo: "https://web-dev-demo.vercel.app",
      longDescription:
        "Our web development services focus on building robust and scalable web applications using the latest technologies. We ensure high performance, security, and maintainability for your online presence. We specialize in the MERN stack (MongoDB, Express, React, Node.js) to create dynamic and responsive web applications. Our development process follows best practices for clean, maintainable code that can grow with your business. We implement security measures to protect your data and your users. Whether you need a simple website or a complex web application, we have the expertise to bring your vision to life.",
    },
    "seo-optimization": {
      title: "SEO Optimization",
      description:
        "Improving website visibility on search engines through effective SEO strategies to increase organic traffic.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["SEO Tools", "Analytics", "Content Strategy"],
      category: "marketing",
      github: "https://github.com/sanjeevkd",
      demo: "https://seo-demo.vercel.app",
      longDescription:
        "Our SEO optimization services focus on improving your website's visibility on search engines through effective strategies. We help increase organic traffic and ensure your site ranks higher in search results. Our approach includes keyword research, on-page optimization, technical SEO improvements, and content strategy. We analyze your competitors to identify opportunities and track your performance with detailed analytics. Our goal is to drive more qualified traffic to your website, increasing leads and conversions. We stay updated with the latest search engine algorithms to ensure your site maintains its ranking.",
    },
    "mobile-app": {
      title: "Mobile App Development",
      description: "Creating responsive and user-friendly mobile applications for Android and iOS platforms.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["React Native", "Kotlin", "Swift"],
      category: "app",
      github: "https://github.com/sanjeevkd",
      demo: "https://mobile-app-demo.vercel.app",
      longDescription:
        "Our mobile app development services focus on creating responsive and user-friendly applications for Android and iOS platforms. We use technologies like React Native for cross-platform development, as well as native languages like Kotlin and Swift when needed. Our apps are designed with the user in mind, ensuring intuitive navigation and a seamless experience. We implement features like push notifications, offline functionality, and secure authentication to enhance user engagement. Our testing process ensures your app works flawlessly across different devices and operating systems.",
    },
    "graphic-design": {
      title: "Graphic Design",
      description: "Creating visual content to communicate messages through typography, color, and images.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["Photoshop", "Illustrator", "InDesign"],
      category: "design",
      github: "https://github.com/sanjeevkd",
      demo: "https://graphic-design-demo.vercel.app",
      longDescription:
        "Our graphic design services focus on creating visual content that effectively communicates your message through typography, color, and images. We create designs for various purposes including logos, marketing materials, social media graphics, and more. Our designers have a keen eye for detail and stay updated with the latest design trends. We work closely with you to understand your brand and target audience, ensuring our designs resonate with your intended viewers. From concept to final product, we ensure high-quality designs that make an impact.",
    },
  }

  const project = projects[id as keyof typeof projects]

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat {id}.json
          </p>
          <div className="mb-4">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 rounded-md overflow-hidden">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors"
        >
          <Github size={16} /> View on GitHub
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.longDescription}</p>
      </div>
    </div>
  )
}

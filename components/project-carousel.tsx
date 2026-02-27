"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import type { Project } from "@/lib/models/project"

interface ProjectCarouselProps {
  projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Double down on projects if there are too few, so we can achieve a seamless infinite wrap-around 
  // without the cards "flying across" the front when shifting from end to start.
  const displayProjects = 
    projects.length > 0 && projects.length < 6 
      ? [...projects, ...projects, ...projects, ...projects].slice(0, Math.max(7, projects.length * 3))
      : projects

  const count = displayProjects.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating || count <= 1) return
      setIsAnimating(true)
      setActiveIndex((prev) => (prev + dir + count) % count)
      setTimeout(() => setIsAnimating(false), 500)
    },
    [isAnimating, count]
  )

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => go(1), 4000)
    return () => clearInterval(timer)
  }, [go, count])

  if (count === 0) return null

  const getOffset = (index: number) => {
    let offset = index - activeIndex
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count
    return offset
  }

  const handleDotClick = (dotIndex: number) => {
    if (isAnimating) return
    const currentMod = activeIndex % projects.length
    let diff = dotIndex - currentMod
    if (diff > projects.length / 2) diff -= projects.length
    if (diff < -projects.length / 2) diff += projects.length

    setIsAnimating(true)
    setActiveIndex((prev) => (prev + diff + count) % count)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="relative w-full py-4 sm:py-8 overflow-hidden sm:overflow-visible">
      {/* 3D Coverflow Stage */}
      <div
        className="relative flex items-center justify-center h-[26rem] sm:h-[34rem]"
        style={{
          perspective: isMobile ? "900px" : "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {displayProjects.map((project, index) => {
          const offset = getOffset(index)
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          // Visibility range (how many cards to show on left/right wings)
          const isVisible = absOffset <= 2

          // Kinematic attributes
          const translateX = offset * (isMobile ? 55 : 60)
          const translateZ = -absOffset * (isMobile ? 120 : 160)
          const rotateY = -offset * (isMobile ? 20 : 25) // The Card Turning Effect
          const scale = 1 - absOffset * 0.1
          const zIndex = 20 - absOffset
          const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.35

          return (
            <div
              key={`${project._id || project.id}-${index}`}
              className="absolute w-full max-w-[260px] sm:max-w-md transition-all duration-500 ease-out rounded-xl"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                pointerEvents: isActive ? "auto" : "none",
                filter: `brightness(${isActive ? 1 : 1 - absOffset * 0.3})`,
                visibility: isVisible ? "visible" : "hidden",
                transformStyle: "preserve-3d",
              }}
              onClick={() => {
                if (!isActive) {
                  go(offset > 0 ? 1 : -1)
                }
              }}
            >
              {/* Card Container */}
              <div
                className={`bg-card/95 backdrop-blur-sm border rounded-xl overflow-hidden shadow-2xl transition-colors duration-300 ${
                  isActive
                    ? "border-primary/50 shadow-primary/20"
                    : "border-border/60 cursor-pointer hover:border-primary/40"
                }`}
              >
                {/* Image Area */}
                <div className="relative h-44 sm:h-52">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-2">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 whitespace-nowrap"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Area */}
                <div className="p-4 sm:p-5">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  {isActive && (
                    <Link
                      href={`/projects/${project.id || project._id}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium border border-primary/20 bg-primary/10 px-3 py-1.5 rounded-md w-full justify-center hover:bg-primary hover:text-primary-foreground"
                    >
                      View Project Details <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border hover:border-primary hover:text-primary text-muted-foreground flex items-center justify-center transition-colors shadow-lg z-30"
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border hover:border-primary hover:text-primary text-muted-foreground flex items-center justify-center transition-colors shadow-lg z-30"
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-2 sm:mt-6 z-30 relative">
            {projects.map((_, i) => {
              const isActiveDot = i === (activeIndex % projects.length)
              return (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`rounded-full transition-all duration-300 ${
                    isActiveDot
                      ? "w-8 h-2 bg-primary shadow-lg shadow-primary/30"
                      : "w-2 h-2 bg-border hover:bg-muted-foreground cursor-pointer"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "fade"
}

export function SectionReveal({ children, className = "", delay = 0, direction = "up" }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const directionStyles: Record<string, string> = {
    up: visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
    left: visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
    right: visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
    fade: visible ? "opacity-100" : "opacity-0",
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionStyles[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

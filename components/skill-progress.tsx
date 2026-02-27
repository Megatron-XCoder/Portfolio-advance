"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface SkillProgressProps {
  name: string
  percentage: number
}

export function SkillProgress({ name, percentage }: SkillProgressProps) {
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [barWidth, setBarWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // Intersection Observer — trigger animation only when scrolled into view
  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated.current) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          // Small delay so the user sees it start from 0
          setTimeout(() => setVisible(true), 200)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Animated counter: 0 → percentage with ease-out curve
  useEffect(() => {
    if (!visible) return
    const duration = 1400
    const frameDuration = 16
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    // Start bar width animation
    setBarWidth(percentage)

    const timer = setInterval(() => {
      frame++
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3)
      setCount(Math.round(progress * percentage))
      if (frame >= totalFrames) {
        setCount(percentage)
        clearInterval(timer)
      }
    }, frameDuration)
    return () => clearInterval(timer)
  }, [visible, percentage])

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-bold text-primary tabular-nums min-w-[36px] text-right">
          {visible ? count : 0}%
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-[1.4s] ease-out"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState, useRef } from "react"

interface TerminalProps {
  text: string
  typingSpeed?: number
  className?: string
  showPrompt?: boolean
  onComplete?: () => void
}

export function Terminal({
                           text,
                           typingSpeed = 50,
                           className = "",
                           showPrompt = true,
                           onComplete
                         }: TerminalProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("")
    setIsTyping(true)

    let currentIndex = 0
    let timer: NodeJS.Timeout

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex])
        currentIndex++
        timer = setTimeout(typeNextCharacter, typingSpeed)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    // Start typing after a small delay
    const startTimer = setTimeout(() => {
      typeNextCharacter()
    }, 300)

    return () => {
      clearTimeout(timer)
      clearTimeout(startTimer)
    }
  }, [text, typingSpeed]) // Only depend on text and typingSpeed

  return (
      <div className={`terminal-window ${className}`} ref={containerRef}>
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">terminal</div>
        </div>
        <div className="terminal-content">
          {showPrompt && <span className="text-primary">$ </span>}
          <span>{displayedText}</span>
          {isTyping && <span className="terminal-cursor animate-pulse">|</span>}
        </div>
      </div>
  )
}
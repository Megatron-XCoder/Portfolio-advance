"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated from secure HTTP-only cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check")
        const data = await res.json()
        setIsAuthenticated(!!data.authenticated)
      } catch (e) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      
      if (res.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsAuthenticated(false)
    } catch (e) {
      // Still set unauthenticated if fetch fails mostly
      setIsAuthenticated(false)
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

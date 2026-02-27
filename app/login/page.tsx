"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const success = await login(username, password)
    if (success) {
      router.push("/admin")
    } else {
      setError("Invalid username or password")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="terminal-window w-full max-w-md">
        <div className="terminal-header flex justify-between items-center">
          <div className="flex items-center">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">admin_login.sh</div>
          </div>
        </div>
        <div className="terminal-content p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm mb-1">
                <span className="text-primary">username:</span>
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                <span className="text-primary">password:</span>
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

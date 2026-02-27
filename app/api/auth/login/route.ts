import { NextResponse } from "next/server"
import { signToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // In a real application, check against database or secure env vars
    // Defaulting to root/0000 for demonstration purposes as per previous code
    const validUsername = process.env.ADMIN_USERNAME || "root"
    const validPassword = process.env.ADMIN_PASSWORD || "0000"

    if (username === validUsername && password === validPassword) {
      // Create session payload
      const token = await signToken({ username, role: "admin" })
      
      // Set HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

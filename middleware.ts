import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/auth"

const protectedApiPaths = ["/api/blogs", "/api/projects", "/api/resume", "/api/categories"]
const protectedPages = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect /admin and its subdirectories
  const isProtectedPage = protectedPages.some((path) => pathname.startsWith(path))
  
  // Protect API mutations
  const isProtectedApiMutation = 
    request.method !== "GET" && 
    protectedApiPaths.some((path) => pathname.startsWith(path))

  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    const token = request.cookies.get("session")?.value
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  if (isProtectedPage || isProtectedApiMutation) {
    // If running at edge, verify Token from cookies
    const token = request.cookies.get("session")?.value
    
    // Quick fallback check for basic protection if verification fails but cookie exists
    // (full verification usually best done but edge runtime limitations might apply to some libraries)
    // We are using `jose` which is Edge compatible.
    
    if (!token) {
       // User is not authenticated
       if (isProtectedApiMutation) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
       } else {
         return NextResponse.redirect(new URL("/login", request.url))
       }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FolderKanban, FileText, Tags, FileOutput, LogOut, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Resume", href: "/admin/resume", icon: FileOutput },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Quick protection jump (middleware handles the real protection)
  useEffect(() => {
    // Only redirect if explicitly known not authenticated. 
    // Auth context initializes as false, so we wait briefly or let middleware do the heavy lifting.
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -mt-4 -mx-4 overflow-hidden rounded-lg border border-border bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          <span className="font-bold text-lg text-primary">Admin Panel</span>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center lg:hidden h-16 border-b border-border px-4 bg-card">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </Button>
          <span className="ml-4 font-semibold text-foreground">Admin Menu</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  )
}

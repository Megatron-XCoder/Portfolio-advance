"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FolderKanban, FileText, Tags, ArrowRight, Activity, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, categories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, blogsRes, categoriesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/blogs"),
          fetch("/api/categories")
        ])
        const projects = await projectsRes.json()
        const blogs = await blogsRes.json()
        const categories = await categoriesRes.json()
        
        setStats({
          projects: projects.length || 0,
          blogs: blogs.length || 0,
          categories: categories.length || 0
        })
      } catch (e) {
        console.error("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const StatCard = ({ title, value, icon: Icon, href }: any) => (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between card-hover relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
        <Icon size={120} />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight">
            {loading ? <span className="animate-pulse bg-muted rounded w-12 h-10 inline-block"></span> : value}
          </h3>
        </div>
        <div className="p-3 bg-secondary rounded-md text-primary">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href={href} className="flex-1">
          <Button variant="secondary" className="w-full text-xs" size="sm">
            View All <ArrowRight size={14} className="ml-1" />
          </Button>
        </Link>
        <Link href={href === "/admin/categories" ? "/admin/categories" : `${href}/new`}>
          <Button variant="default" size="sm" className="px-2">
            <Plus size={16} />
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Activity className="text-primary" size={28} />
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground">Here is an overview of your portfolio content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={stats.projects} icon={FolderKanban} href="/admin/projects" />
        <StatCard title="Published Blogs" value={stats.blogs} icon={FileText} href="/admin/blogs" />
        <StatCard title="Categories" value={stats.categories} icon={Tags} href="/admin/categories" />
      </div>

      <div className="mt-8">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">system_status.sh</div>
          </div>
          <div className="terminal-content p-4 text-sm font-mono leading-relaxed opacity-80">
            <p className="text-green-400">root@portfolio-admin:~# systemctl status portfolio-core</p>
            <p>● portfolio-core.service - Portfolio Main Application</p>
            <p>   Loaded: loaded (/lib/systemd/system/portfolio.service; enabled)</p>
            <p className="text-green-400">   Active: active (running) since {new Date().toLocaleDateString()}</p>
            <p>   Docs: https://github.com/SanjeevKumarDas</p>
            <p>   Main PID: 1 (node)</p>
            <p className="text-blue-400">{"\n"}[✓] Authentication module secured and active.</p>
            <p className="text-blue-400">[✓] Database connection established.</p>
            <p className="text-blue-400">[✓] Storage systems operational.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

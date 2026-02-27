"use client"

import { useEffect, useState } from "react"
import { Tags, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/models/category"
import { toast } from "sonner"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        setCategories(await res.json())
      }
    } catch (e) {
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setSaving(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })

      if (res.ok) {
        const newCategory = await res.json()
        setCategories([...categories, newCategory])
        setNewCategoryName("")
        toast.success("Category created successfully")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to create category")
      }
    } catch (e) {
      toast.error("An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return

    setDeletingId(slug)
    try {
      const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Category deleted successfully")
        setCategories((prev) => prev.filter((c) => c.id !== slug))
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to delete category")
      }
    } catch (e) {
      toast.error("An error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tags className="text-primary" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">Manage project and blog categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Add New Category</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., React JS, DevOps"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={saving || !newCategoryName.trim()}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Create Category
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12 text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Tags size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No categories found</h3>
                <p className="text-muted-foreground mt-1 mb-4">You haven't added any categories yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">ID / Slug</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((category) => (
                      <tr key={category._id?.toString() || category.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{category.id}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            disabled={deletingId === category.id}
                            onClick={() => handleDelete(category.id, category.name)}
                          >
                            {deletingId === category.id ? (
                              <Loader2 size={16} className="animate-spin text-muted-foreground" />
                            ) : (
                              <Trash2 size={16} className="text-destructive" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

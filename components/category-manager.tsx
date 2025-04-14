"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react"
import type { Category } from "@/lib/models/category"

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")

      if (!res.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await res.json()
      setCategories(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      setAdding(true)
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add category")
      }

      await fetchCategories()
      setNewCategoryName("")
      setError(null)
    } catch (err) {
      console.error("Error adding category:", err)
      setError(err instanceof Error ? err.message : "Failed to add category")
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      setDeleting(id)
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete category")
      }

      await fetchCategories()
      setError(null)
    } catch (err) {
      console.error("Error deleting category:", err)
      setError(err instanceof Error ? err.message : "Failed to delete category")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manage Categories</h3>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="bg-background border-border"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddCategory()
            }
          }}
        />
        <Button onClick={handleAddCategory} disabled={adding || !newCategoryName.trim()}>
          {adding ? <Loader2 size={16} className="animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
          Add
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No categories found. Add your first category above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
              <span>{category.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                disabled={deleting === category.id}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {deleting === category.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

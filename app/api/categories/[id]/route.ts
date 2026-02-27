import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    // Check if the ID is a valid ObjectId or a slug
    let query = {}
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { id: id }
    }

    // First, find the category so we know its name/slug to check projects
    const category = await db.collection("categories").findOne(query)
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category is in use by any projects (by name, slug, or matching ID)
    const projectsUsingCategory = await db.collection("projects").countDocuments({ 
      $or: [
        { category: category.name },
        { category: category.id },
        { category: id }
      ]
    })

    if (projectsUsingCategory > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: it is in use by ${projectsUsingCategory} project(s)`,
          projectCount: projectsUsingCategory,
        },
        { status: 400 },
      )
    }

    const result = await db.collection("categories").deleteOne(query)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if the ID is a valid ObjectId or a slug
    let query = {}
    if (ObjectId.isValid(params.id)) {
      query = { _id: new ObjectId(params.id) }
    } else {
      query = { id: params.id }
    }

    // Check if category is in use by any projects
    const projectsUsingCategory = await db.collection("projects").countDocuments({ category: params.id })

    if (projectsUsingCategory > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is in use by projects",
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

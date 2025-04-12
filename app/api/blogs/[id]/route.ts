import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { generateSlug } from "@/lib/models/blog"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()

    let blog

    // Check if the ID is a valid ObjectId or a slug
    if (ObjectId.isValid(params.id)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(params.id) })
    } else {
      blog = await db.collection("blogs").findOne({ slug: params.id })
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()

    const data = await request.json()

    // Generate slug from title if title changed
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title)
    }

    // Update timestamp
    data.updatedAt = new Date()

    const result = await db.collection("blogs").updateOne({ _id: new ObjectId(params.id) }, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const updatedBlog = await db.collection("blogs").findOne({ _id: new ObjectId(params.id) })

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}

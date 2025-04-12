import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { type BlogPost, generateSlug } from "@/lib/models/blog"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get("published")

    let query = {}
    if (published === "true") {
      query = { published: true }
    }

    const blogs = await db.collection("blogs").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const data = await request.json()

    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title)
    }

    // Set timestamps
    const now = new Date()
    const blogPost: BlogPost = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("blogs").insertOne(blogPost)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...blogPost,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}

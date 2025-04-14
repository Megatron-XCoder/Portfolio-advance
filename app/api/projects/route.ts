import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { type Project, generateProjectId } from "@/lib/models/project"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get("featured")

    let query = {}
    if (featured === "true") {
      query = { featured: true }
    }

    const projects = await db.collection("projects").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const data = await request.json()

    // Generate ID from title if not provided
    if (!data.id) {
      data.id = generateProjectId(data.title)
    }

    // Set timestamps
    const now = new Date()
    const project: Project = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("projects").insertOne(project)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...project,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

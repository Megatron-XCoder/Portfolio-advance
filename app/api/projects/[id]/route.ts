import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { generateProjectId } from "@/lib/models/project"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    let project

    // Check if the ID is a valid ObjectId or a slug
    if (ObjectId.isValid(id)) {
      project = await db.collection("projects").findOne({ _id: new ObjectId(id) })
    } else {
      project = await db.collection("projects").findOne({ id: id })
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    const data = await request.json()

    // Generate ID from title if title changed
    if (data.title && !data.id) {
      data.id = generateProjectId(data.title)
    }

    // Update timestamp
    data.updatedAt = new Date()

    let query = {}
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { id: id }
    }

    const result = await db.collection("projects").updateOne(query, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updatedProject = await db.collection("projects").findOne(query)

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    let query = {}
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { id: id }
    }

    const result = await db.collection("projects").deleteOne(query)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Binary } from "mongodb" // ✅ this line fixes the error

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Find all resumes, sorting newest first, and omit the large binary 'data' field
    const resumes = await db.collection("resume").find(
        {},
        { projection: { data: 0 }, sort: { uploadedAt: -1 } }
    ).toArray()

    return NextResponse.json(resumes)
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string // The custom title input
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Please provide a title for the resume" }, { status: 400 })
    }
    
    // Check file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Save new resume (we no longer delete the old ones)
    const result = await db.collection("resume").insertOne({
      title: title.trim(),
      filename: file.name,
      contentType: file.type,
      data: new Binary(buffer),
      uploadedAt: new Date()
    })
    
    return NextResponse.json({ success: true, id: result.insertedId, title: title.trim(), filename: file.name })
  } catch (error) {
    console.error("Error uploading resume:", error)
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 })
  }
}


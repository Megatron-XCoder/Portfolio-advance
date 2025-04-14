import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Binary } from "mongodb" // ✅ this line fixes the error

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const resume = await db.collection("resume").findOne({}, { sort: { uploadedAt: -1 } })

    if (!resume) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 })
    }

    // Convert Binary data to Buffer
    const buffer = Buffer.from(resume.data.buffer)

    // Set appropriate headers for file download
    const headers = new Headers()
    headers.set("Content-Type", resume.contentType)
    headers.set("Content-Disposition", `attachment; filename="${resume.filename}"`)
    headers.set("Content-Length", buffer.length.toString())

    return new NextResponse(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
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
    
    // Delete any existing resume
    await db.collection("resume").deleteMany({})
    
    // Save new resume
    await db.collection("resume").insertOne({
      filename: file.name,
      contentType: file.type,
      data: new Binary(buffer),
      uploadedAt: new Date()
    })
    
    return NextResponse.json({ success: true, filename: file.name })
  } catch (error) {
    console.error("Error uploading resume:", error)
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const result = await db.collection("resume").deleteMany({})
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
  }
}

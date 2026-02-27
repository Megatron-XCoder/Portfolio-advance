import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 })
    }

    const resume = await db.collection("resume").findOne({ _id: new ObjectId(params.id) })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Convert Binary data to Buffer
    const buffer = Buffer.from(resume.data.buffer)

    // Set appropriate headers for file download/inline view
    const headers = new Headers()
    headers.set("Content-Type", resume.contentType)
    // We want preview possible, so inline will open in browser if possible
    headers.set("Content-Disposition", `inline; filename="${resume.filename}"`)
    headers.set("Content-Length", buffer.length.toString())

    return new NextResponse(buffer, {
      status: 200,
      headers: headers as any,
    })
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 })
    }

    const result = await db.collection("resume").deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { type Category, generateCategoryId } from "@/lib/models/category"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const categories = await db.collection("categories").find().sort({ name: 1 }).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const data = await request.json()

    // Generate ID from name if not provided
    if (!data.id) {
      data.id = generateCategoryId(data.name)
    }

    // Check if category already exists
    const existingCategory = await db.collection("categories").findOne({
      $or: [{ id: data.id }, { name: data.name }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }

    // Set timestamps
    const now = new Date()
    const category: Category = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...category,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

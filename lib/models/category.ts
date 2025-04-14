export interface Category {
  _id?: string
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export function generateCategoryId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

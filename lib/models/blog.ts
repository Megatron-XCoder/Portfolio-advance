export interface BlogPost {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  coverImage?: string
  tags?: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
}

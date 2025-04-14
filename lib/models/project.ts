export interface Project {
    _id?: string
    id: string
    title: string
    description: string
    longDescription?: string
    image: string
    technologies: string[]
    category: string
    featured: boolean
    github?: string
    demo?: string
    createdAt: Date
    updatedAt: Date
}

export function generateProjectId(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
}

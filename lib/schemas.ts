import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(300, "Description is too long"),
  longDescription: z.string().optional(),
  image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  github: z.union([z.literal(""), z.string().url("Must be a valid URL").optional()]),
  demo: z.union([z.literal(""), z.string().url("Must be a valid URL").optional()]),
})

export type ProjectFormData = z.infer<typeof projectSchema>

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt is too long"),
  author: z.string().min(2, "Author is required"),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  coverImage: z.union([z.literal(""), z.string().url("Must be a valid URL").optional()]),
})

export type BlogFormData = z.infer<typeof blogSchema>

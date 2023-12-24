import { z } from "zod"

export const createTodoSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().optional(),
})

// create a TS type from the schema
export type CreateTodoSchema = z.infer<typeof createTodoSchema>

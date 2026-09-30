import { z } from 'zod'

export const noteMetadataSchema = z.object({
  title: z.string().min(2, 'Use at least 2 characters.').max(255, 'Keep it under 255 characters.'),
  description: z.string().max(2000, 'Keep it under 2000 characters.'),
  price: z.number().min(0, 'Price cannot be negative.'),
})

export type NoteMetadataValues = z.infer<typeof noteMetadataSchema>

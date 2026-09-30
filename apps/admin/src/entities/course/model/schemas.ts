import { z } from 'zod'

const uuidRule = z.string().min(1, 'Select a value.')
const codeRule = z.string().min(2, 'Use at least 2 characters.').max(20, 'Keep it under 20 characters.')
const nameRule = z.string().min(2, 'Use at least 2 characters.').max(255, 'Keep it under 255 characters.')

export const courseSchema = z.object({
  departmentId: uuidRule,
  levelId: uuidRule,
  semesterId: uuidRule,
  code: codeRule,
  name: nameRule,
  description: z.string().max(2000, 'Keep it under 2000 characters.'),
  lecturerName: z.string().max(255, 'Keep it under 255 characters.'),
})

export const updateCourseSchema = z.object({
  code: codeRule.optional(),
  name: nameRule.optional(),
  description: z.string().max(2000).nullable().optional(),
  lecturerName: z.string().min(2).max(255).nullable().optional(),
})

export type CourseValues = z.infer<typeof courseSchema>
export type UpdateCourseValues = z.infer<typeof updateCourseSchema>

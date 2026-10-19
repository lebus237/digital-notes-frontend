import { z } from 'zod'

const nameRule = z.string().min(2, 'Use at least 2 characters.').max(255, 'Keep it under 255 characters.')
const uuidRule = z.string().min(1, 'Select a value.')

export const universitySchema = z.object({
  name: nameRule,
})

export const facultySchema = z.object({
  universityId: uuidRule,
  name: nameRule,
})

export const departmentSchema = z.object({
  facultyId: uuidRule,
  name: nameRule,
})

export const levelSchema = z.object({
  departmentId: uuidRule,
  name: nameRule,
})

export const semesterSchema = z.object({
  name: nameRule,
})

export type UniversityValues = z.infer<typeof universitySchema>
export type FacultyValues = z.infer<typeof facultySchema>
export type DepartmentValues = z.infer<typeof departmentSchema>
export type LevelValues = z.infer<typeof levelSchema>
export type SemesterValues = z.infer<typeof semesterSchema>

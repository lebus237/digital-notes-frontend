import { createFileRoute } from '@tanstack/react-router'
import { FacultyPage } from '@/pages/catalogue'

export const Route = createFileRoute('/faculties/$facultyId')({
  component: FacultyPage,
})

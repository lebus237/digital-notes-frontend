import { createFileRoute } from '@tanstack/react-router'
import { CoursePage } from '@/pages/catalogue'

export const Route = createFileRoute('/courses/$courseId')({
  component: CoursePage,
})

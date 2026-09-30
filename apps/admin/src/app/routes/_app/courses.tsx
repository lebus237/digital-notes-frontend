import { createFileRoute } from '@tanstack/react-router'
import { CoursesView } from '@/pages/courses'

export const Route = createFileRoute('/_app/courses')({
  component: CoursesView,
})

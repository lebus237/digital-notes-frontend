import { createFileRoute } from '@tanstack/react-router'
import { CourseNotesView } from '@/pages/courses'

export const Route = createFileRoute('/_app/courses/$departmentId/$courseId/')({
  component: CourseNotesView,
})

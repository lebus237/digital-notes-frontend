import { createFileRoute } from '@tanstack/react-router'
import { DepartmentCoursesView } from '@/pages/courses'

export const Route = createFileRoute('/_app/courses/$departmentId/')({
  component: DepartmentCoursesView,
})

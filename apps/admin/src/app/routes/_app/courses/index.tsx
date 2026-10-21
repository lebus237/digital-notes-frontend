import { createFileRoute } from '@tanstack/react-router'
import { DepartmentsView } from '@/pages/courses'

export const Route = createFileRoute('/_app/courses/')({
  component: DepartmentsView,
})

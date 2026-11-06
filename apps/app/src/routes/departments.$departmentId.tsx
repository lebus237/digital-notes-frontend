import { createFileRoute } from '@tanstack/react-router'
import { DepartmentPage } from '@/pages/catalogue'

export const Route = createFileRoute('/departments/$departmentId')({
  component: DepartmentPage,
})

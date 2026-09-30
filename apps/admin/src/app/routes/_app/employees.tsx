import { createFileRoute } from '@tanstack/react-router'
import { EmployeesView } from '@/pages/employees'

export const Route = createFileRoute('/_app/employees')({
  component: EmployeesView,
})

import { createFileRoute } from '@tanstack/react-router'
import { DepartmentsView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation/departments')({
  validateSearch: (search: Record<string, unknown>) => ({
    universityId:
      typeof search.universityId === 'string' ? search.universityId : undefined,
    facultyId:
      typeof search.facultyId === 'string' ? search.facultyId : undefined,
  }),
  component: DepartmentsView,
})

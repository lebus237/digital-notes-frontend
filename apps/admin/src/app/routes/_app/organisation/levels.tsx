import { createFileRoute } from '@tanstack/react-router'
import { LevelsView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation/levels')({
  validateSearch: (search: Record<string, unknown>) => ({
    universityId:
      typeof search.universityId === 'string' ? search.universityId : undefined,
    facultyId:
      typeof search.facultyId === 'string' ? search.facultyId : undefined,
    departmentId:
      typeof search.departmentId === 'string' ? search.departmentId : undefined,
  }),
  component: LevelsView,
})

import { createFileRoute } from '@tanstack/react-router'
import { FacultiesView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation/faculties')({
  validateSearch: (search: Record<string, unknown>) => ({
    universityId:
      typeof search.universityId === 'string' ? search.universityId : undefined,
  }),
  component: FacultiesView,
})

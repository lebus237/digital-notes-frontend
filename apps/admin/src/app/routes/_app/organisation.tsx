import { createFileRoute } from '@tanstack/react-router'
import { OrganisationView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === 'string' ? search.tab : undefined,
  }),
  component: OrganisationView,
})

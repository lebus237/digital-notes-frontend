import { createFileRoute } from '@tanstack/react-router'
import { OrganisationView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation')({
  component: OrganisationView,
})

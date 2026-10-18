import { createFileRoute } from '@tanstack/react-router'
import { UniversitiesView } from '@/pages/organisation'

export const Route = createFileRoute('/_app/organisation/')({
  component: UniversitiesView,
})

import { createFileRoute } from '@tanstack/react-router'
import { UniversityPage } from '@/pages/catalogue'

export const Route = createFileRoute('/universities/$universityId')({
  component: UniversityPage,
})

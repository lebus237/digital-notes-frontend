import { createFileRoute } from '@tanstack/react-router'
import { ReviewView } from '@/pages/review'

export const Route = createFileRoute('/_app/')({
  component: ReviewView,
})

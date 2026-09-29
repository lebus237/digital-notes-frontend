import { SubmitView } from '@/pages/submit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/submit')({
  component: SubmitView,
})

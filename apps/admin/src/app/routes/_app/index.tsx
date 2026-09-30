import { createFileRoute } from '@tanstack/react-router'
import { DashboardView } from '@/pages/dashboard'

export const Route = createFileRoute('/_app/')({
  component: DashboardView,
})

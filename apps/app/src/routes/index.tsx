import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/catalogue'

export const Route = createFileRoute('/')({
  component: HomePage,
})

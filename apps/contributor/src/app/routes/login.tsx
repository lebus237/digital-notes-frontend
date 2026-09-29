import { createFileRoute } from '@tanstack/react-router'
import { LoginView } from '@/pages/login'

export const Route = createFileRoute('/login')({
  component: LoginView,
})

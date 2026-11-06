import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/pages/account'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

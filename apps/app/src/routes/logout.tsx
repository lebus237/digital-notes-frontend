import { createFileRoute } from '@tanstack/react-router'
import { LogoutView } from '@digitalnotes/core'

export const Route = createFileRoute('/logout')({
  component: LogoutView,
})

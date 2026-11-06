import { createFileRoute } from '@tanstack/react-router'
import { LibraryPage } from '@/pages/account'

export const Route = createFileRoute('/library')({
  component: LibraryPage,
})

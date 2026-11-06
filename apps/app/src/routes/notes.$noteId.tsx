import { createFileRoute } from '@tanstack/react-router'
import { NotePage } from '@/pages/catalogue'

export const Route = createFileRoute('/notes/$noteId')({
  component: NotePage,
})

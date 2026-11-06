import { createFileRoute } from '@tanstack/react-router'
import { NotePage } from '@/pages/note'

export const Route = createFileRoute('/_app/notes/$noteId')({
  component: NotePage,
})

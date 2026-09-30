import { createFileRoute } from '@tanstack/react-router'
import { NotesView } from '@/pages/notes'

export const Route = createFileRoute('/_app/submit')({
  component: NotesView,
})

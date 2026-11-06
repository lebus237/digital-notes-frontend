import { createFileRoute } from '@tanstack/react-router'
import { NotesReviewView } from '@/pages/notes'

export const Route = createFileRoute('/_app/notes')({
  component: NotesReviewView,
})

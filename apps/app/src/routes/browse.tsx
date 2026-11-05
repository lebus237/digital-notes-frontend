import { createFileRoute } from '@tanstack/react-router'
import { BrowsePage } from '@/pages/catalogue'

export const Route = createFileRoute('/browse')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { q?: string; type?: string; page?: number } = {}
    if (typeof search.q === 'string' && search.q.trim() !== '') parsed.q = search.q
    if (typeof search.type === 'string' && search.type.trim() !== '') parsed.type = search.type
    const page = Number(search.page)
    if (Number.isFinite(page) && page > 1) parsed.page = page
    return parsed
  },
  component: BrowsePage,
})

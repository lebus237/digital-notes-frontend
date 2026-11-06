import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/auth'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { redirect?: string; notice?: string } = {}
    if (typeof search.redirect === 'string' && search.redirect.startsWith('/')) {
      parsed.redirect = search.redirect
    }
    if (typeof search.notice === 'string') {
      parsed.notice = search.notice
    }
    return parsed
  },
  component: LoginPage,
})

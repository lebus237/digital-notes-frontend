import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/auth'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { redirect?: string } = {}
    if (typeof search.redirect === 'string' && search.redirect.startsWith('/')) {
      parsed.redirect = search.redirect
    }
    return parsed
  },
  component: LoginPage,
})

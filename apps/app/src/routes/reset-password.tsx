import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@/pages/auth'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { token?: string } = {}
    if (typeof search.token === 'string' && search.token.trim() !== '') {
      parsed.token = search.token
    }
    return parsed
  },
  component: ResetPasswordPage,
})

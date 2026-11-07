import { createFileRoute } from '@tanstack/react-router'
import { logoutStudent } from '@/shared/api/endpoints/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/logout')({
  component: LogoutRoute,
})

function LogoutRoute() {
  useEffect(() => {
    void logoutStudent().finally(() => window.location.replace('/login'))
  }, [])

  return null
}

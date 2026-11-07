import { useEffect, useState } from 'react'
import {
  AUTH_CHANGED_EVENT,
  getSessionUser,
  hasSession,
  type SessionUser,
} from '@/shared/api/endpoints/auth'

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setUser(getSessionUser())
      setAuthenticated(hasSession())
      setReady(true)
    }

    sync()
    window.addEventListener(AUTH_CHANGED_EVENT, sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { user, authenticated, ready }
}

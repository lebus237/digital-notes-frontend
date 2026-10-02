import { IconNotes } from '@tabler/icons-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShellLayout, type SidebarConfig } from '@digitalnotes/core'
import { NotesProvider } from '@/entities/note'
import { ThemeSwitcher } from '@/features/switch-theme'
import { useEffect, useState } from 'react'

const sidebarConfig: SidebarConfig = {
  items: [
    {
      id: 'notes',
      label: 'Notes',
      icon: IconNotes,
      keywords: ['notes'],
      children: [
        { id: 'my-notes', label: 'My notes', to: '/' },
        { id: 'submit', label: 'Submit', to: '/submit' },
      ],
    },
  ],
}

type SessionUser = {
  fullName?: string
  email?: string
  phoneNumber?: string
}

function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('app-user')
      if (!raw) return
      setUser(JSON.parse(raw) as SessionUser)
    } catch {
      setUser(null)
    }
  }, [])

  return user
}

export const Route = createFileRoute('/_app')({
  component: ContributorLayout,
})

function ContributorLayout() {
  const user = useSessionUser()
  const profileName = user?.fullName || user?.email || user?.phoneNumber || 'Contributor'
  const profileMeta = user?.email && user.email !== profileName ? user.email : user ? 'Signed in' : 'Not signed in'

  return (
    <NotesProvider>
      <AppShellLayout
        sidebarConfig={sidebarConfig}
        brandName="DigitalNotes"
        brandMeta="Contributor"
        profileName={profileName}
        profileMeta={profileMeta}
        headerEnd={<ThemeSwitcher />}
      >
        <Outlet />
      </AppShellLayout>
    </NotesProvider>
  )
}

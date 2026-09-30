import { AppShell, Breadcrumbs, TextInput } from '@mantine/core'
import { IconChevronDown, IconLayoutSidebar, IconNotes, IconSearch } from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { ThemeSwitcher } from '@/features/switch-theme'
import { ShellProvider, useShell, type ShellCrumb } from '../model/shell-context'
import styles from './app-shell.module.scss'

const notesLinks = [
  { label: 'My notes', to: '/' as const },
  { label: 'Submit', to: '/submit' as const },
]

type SessionUser = {
  fullName?: string
  email?: string
  phoneNumber?: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 62em)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isMobile
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

function ShellCrumbs({ breadcrumbs }: Readonly<{ breadcrumbs: ShellCrumb[] }>) {
  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumbs className={styles.crumbs} separatorMargin="xs">
      {breadcrumbs.map((crumb) =>
        crumb.to ? (
          <Link key={crumb.label} to={crumb.to} className={styles.crumbLink}>
            {crumb.label}
          </Link>
        ) : (
          <span key={crumb.label}>{crumb.label}</span>
        ),
      )}
    </Breadcrumbs>
  )
}

function AppShellFrame({ children }: Readonly<{ children: ReactNode }>) {
  const { breadcrumbs } = useShell()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isMobile = useIsMobile()
  const user = useSessionUser()
  const [desktopOpened, setDesktopOpened] = useState(true)
  const [mobileOpened, setMobileOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [notesOpen, setNotesOpen] = useState(true)

  useEffect(() => {
    setMobileOpened(false)
  }, [pathname])

  const normalizedQuery = query.trim().toLowerCase()
  const visibleLinks = notesLinks.filter((link) => {
    if (normalizedQuery === '') return true
    return link.label.toLowerCase().includes(normalizedQuery) || 'notes'.includes(normalizedQuery)
  })
  const showNotesGroup = normalizedQuery === '' || visibleLinks.length > 0 || 'notes'.includes(normalizedQuery)

  function toggleSidebar() {
    if (isMobile) {
      setMobileOpened((open) => !open)
      return
    }
    setDesktopOpened((open) => !open)
  }

  const displayName = user?.fullName || user?.email || user?.phoneNumber || 'Contributor'
  const displayMeta = user?.email && user.email !== displayName ? user.email : user ? 'Signed in' : 'Not signed in'

  return (
    <AppShell
      className={styles.shell}
      layout="alt"
      header={{ height: 64 }}
      navbar={{
        width: '16rem',
        breakpoint: 'md',
        collapsed: { desktop: !desktopOpened, mobile: !mobileOpened },
      }}
      padding={0}
    >
      <AppShell.Header className={styles.header}>
        <button type="button" className={styles.trigger} onClick={toggleSidebar} aria-label="Toggle sidebar">
          <IconLayoutSidebar size={20} />
        </button>
        <span className={styles.headerRule} aria-hidden="true" />
        <ShellCrumbs breadcrumbs={breadcrumbs} />
        <div className={styles.headerEnd}>
          <ThemeSwitcher />
        </div>
      </AppShell.Header>

      <AppShell.Navbar className={styles.navbar} p={0}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">DN</span>
          <span>
            <span className={styles.brandName}>DigitalNotes</span>
            <span className={styles.brandMeta}>Contributor</span>
          </span>
        </div>
        <div className={styles.searchGroup}>
          <TextInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search items..."
            leftSection={<IconSearch size={16} />}
            aria-label="Search items"
          />
        </div>
        <div className={styles.rule} />
        <nav className={styles.nav} aria-label="Primary">
          {showNotesGroup && (
            <div>
              <button
                type="button"
                className={styles.groupButton}
                aria-expanded={notesOpen}
                onClick={() => setNotesOpen((open) => !open)}
              >
                <span className={styles.groupLabel}>
                  <IconNotes size={18} aria-hidden="true" />
                  Notes
                </span>
                <IconChevronDown
                  size={18}
                  className={`${styles.chevron} ${notesOpen ? '' : styles.chevronClosed}`}
                  aria-hidden="true"
                />
              </button>
              {notesOpen && (
                <ul className={styles.subMenu}>
                  {visibleLinks.map((link) => {
                    const active = pathname === link.to
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className={`${styles.subLink} ${active ? styles.subLinkActive : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </nav>
        <footer className={styles.footer}>
          <div className={styles.profile}>
            <span className={styles.avatar} aria-hidden="true">{displayName.slice(0, 1).toUpperCase()}</span>
            <span className={styles.profileText}>
              <span className={styles.profileName}>{displayName}</span>
              <span className={styles.profileMeta}>{displayMeta}</span>
            </span>
          </div>
        </footer>
      </AppShell.Navbar>

      {isMobile && mobileOpened && (
        <button type="button" className={styles.backdrop} aria-label="Close sidebar" onClick={() => setMobileOpened(false)} />
      )}

      <AppShell.Main className={styles.main}>{children}</AppShell.Main>
    </AppShell>
  )
}

export function AppShellLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ShellProvider>
      <AppShellFrame>{children}</AppShellFrame>
    </ShellProvider>
  )
}

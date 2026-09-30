import { AppShell, Breadcrumbs, TextInput } from '@mantine/core'
import { IconBuilding, IconChevronDown, IconClipboardCheck, IconBook, IconLayoutSidebar, IconSearch, IconUsers } from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { ThemeSwitcher } from '@/features/switch-theme'
import { ShellProvider, useShell, type ShellCrumb } from '../model/shell-context'
import styles from './app-shell.module.scss'

const reviewLinks = [
  { label: 'Note review', to: '/' as const },
]

const catalogueLinks = [
  { label: 'Organisation', to: '/organisation' as const, icon: IconBuilding },
  { label: 'Courses', to: '/courses' as const, icon: IconBook },
  { label: 'Employees', to: '/employees' as const, icon: IconUsers },
]

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
  const [desktopOpened, setDesktopOpened] = useState(true)
  const [mobileOpened, setMobileOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [reviewOpen, setReviewOpen] = useState(true)
  const [catalogueOpen, setCatalogueOpen] = useState(true)

  useEffect(() => {
    setMobileOpened(false)
  }, [pathname])

  const normalizedQuery = query.trim().toLowerCase()
  const visibleLinks = reviewLinks.filter((link) => {
    if (normalizedQuery === '') return true
    return link.label.toLowerCase().includes(normalizedQuery) || 'review'.includes(normalizedQuery)
  })
  const visibleCatalogueLinks = catalogueLinks.filter((link) => {
    if (normalizedQuery === '') return true
    return link.label.toLowerCase().includes(normalizedQuery) || 'catalogue'.includes(normalizedQuery)
  })
  const showReviewGroup = normalizedQuery === '' || visibleLinks.length > 0 || 'review'.includes(normalizedQuery)
  const showCatalogueGroup = normalizedQuery === '' || visibleCatalogueLinks.length > 0 || 'catalogue'.includes(normalizedQuery)

  function toggleSidebar() {
    if (isMobile) {
      setMobileOpened((open) => !open)
      return
    }
    setDesktopOpened((open) => !open)
  }

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
            <span className={styles.brandMeta}>Administration</span>
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
          {showReviewGroup && (
            <div>
              <button
                type="button"
                className={styles.groupButton}
                aria-expanded={reviewOpen}
                onClick={() => setReviewOpen((open) => !open)}
              >
                <span className={styles.groupLabel}>
                  <IconClipboardCheck size={18} aria-hidden="true" />
                  Review
                </span>
                <IconChevronDown
                  size={18}
                  className={`${styles.chevron} ${reviewOpen ? '' : styles.chevronClosed}`}
                  aria-hidden="true"
                />
              </button>
              {reviewOpen && (
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
          {showCatalogueGroup && (
            <div>
              <button
                type="button"
                className={styles.groupButton}
                aria-expanded={catalogueOpen}
                onClick={() => setCatalogueOpen((open) => !open)}
              >
                <span className={styles.groupLabel}>
                  <IconBuilding size={18} aria-hidden="true" />
                  Catalogue
                </span>
                <IconChevronDown
                  size={18}
                  className={`${styles.chevron} ${catalogueOpen ? '' : styles.chevronClosed}`}
                  aria-hidden="true"
                />
              </button>
              {catalogueOpen && (
                <ul className={styles.subMenu}>
                  {visibleCatalogueLinks.map((link) => {
                    const active = pathname === link.to
                    const Icon = link.icon
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className={`${styles.subLink} ${active ? styles.subLinkActive : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon size={16} aria-hidden="true" />
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
            <span className={styles.avatar} aria-hidden="true">A</span>
            <span className={styles.profileText}>
              <span className={styles.profileName}>Administrator</span>
              <span className={styles.profileMeta}>Review queue</span>
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

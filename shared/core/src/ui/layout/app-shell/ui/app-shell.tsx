import { AppShell, Breadcrumbs, TextInput } from '@mantine/core'
import { IconChevronDown, IconLayoutSidebar, IconSearch } from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { ShellProvider, useShell, type ShellCrumb } from '../model/shell-context'
import styles from './app-shell.module.scss'

type SidebarIcon = ComponentType<{ size?: number; 'aria-hidden'?: boolean }>

export type SidebarConfigItem = {
  id: string
  label: string
  to?: string
  icon?: SidebarIcon
  keywords?: string[]
  children?: SidebarConfigItem[]
}

export type SidebarConfig = {
  items: SidebarConfigItem[]
}

type AppShellLayoutProps = {
  sidebarConfig: SidebarConfig
  brandName: string
  brandMeta: string
  profileName: string
  profileMeta: string
  profileAvatar?: string
  headerEnd?: ReactNode
  children: ReactNode
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

function matchesQuery(item: SidebarConfigItem, query: string, parent?: SidebarConfigItem) {
  if (query === '') return true
  const searchableText = [item.label, ...(item.keywords ?? []), ...(parent ? [parent.label, ...(parent.keywords ?? [])] : [])]
  return searchableText.some((text) => text.toLowerCase().includes(query))
}

function ShellCrumbs({ breadcrumbs }: Readonly<{ breadcrumbs: ShellCrumb[] }>) {
  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumbs className={styles.crumbs} separatorMargin="xs">
      {breadcrumbs.map((crumb) =>
        crumb.to ? (
          <Link key={crumb.label} to={crumb.to as never} className={styles.crumbLink}>
            {crumb.label}
          </Link>
        ) : (
          <span key={crumb.label}>{crumb.label}</span>
        ),
      )}
    </Breadcrumbs>
  )
}

function SidebarLink({ item, active, standalone = false }: Readonly<{ item: SidebarConfigItem; active: boolean; standalone?: boolean }>) {
  if (!item.to) return null
  const Icon = item.icon
  const className = standalone
    ? `${styles.subLink} ${styles.standaloneLink} ${active ? styles.subLinkActive : ''}`
    : `${styles.subLink} ${active ? styles.subLinkActive : ''}`

  return (
    <Link
      to={item.to as never}
      className={className}
      aria-current={active ? 'page' : undefined}
    >
      {Icon && <Icon size={16} aria-hidden={true} />}
      {item.label}
    </Link>
  )
}

function AppShellFrame({
  sidebarConfig,
  brandName,
  brandMeta,
  profileName,
  profileMeta,
  profileAvatar,
  headerEnd,
  children,
}: Readonly<AppShellLayoutProps>) {
  const { breadcrumbs } = useShell()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isMobile = useIsMobile()
  const [desktopOpened, setDesktopOpened] = useState(true)
  const [mobileOpened, setMobileOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMobileOpened(false)
  }, [pathname])

  const normalizedQuery = query.trim().toLowerCase()

  function toggleSidebar() {
    if (isMobile) {
      setMobileOpened((open) => !open)
      return
    }
    setDesktopOpened((open) => !open)
  }

  function renderItem(item: SidebarConfigItem) {
    if (!item.children) {
      return (
        <li key={item.id}>
          <SidebarLink item={item} active={pathname === item.to} standalone />
        </li>
      )
    }

    const groupMatches = matchesQuery(item, normalizedQuery)
    const visibleChildren = item.children.filter((child) => groupMatches || matchesQuery(child, normalizedQuery, item))
    if (!groupMatches && visibleChildren.length === 0) return null

    const expanded = normalizedQuery !== '' || (openGroups[item.id] ?? true)
    const Icon = item.icon

    return (
      <li key={item.id}>
        <button
          type="button"
          className={styles.groupButton}
          aria-expanded={expanded}
          onClick={() => setOpenGroups((groups) => ({ ...groups, [item.id]: !expanded }))}
        >
          <span className={styles.groupLabel}>
            {Icon && <Icon size={18} aria-hidden={true} />}
            {item.label}
          </span>
          <IconChevronDown
            size={18}
            className={`${styles.chevron} ${expanded ? '' : styles.chevronClosed}`}
            aria-hidden="true"
          />
        </button>
        {expanded && (
          <ul className={styles.subMenu}>
            {visibleChildren.map((child) => (
              <li key={child.id}>
                <SidebarLink item={child} active={pathname === child.to} />
              </li>
            ))}
          </ul>
        )}
      </li>
    )
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
        <div className={styles.headerEnd}>{headerEnd}</div>
      </AppShell.Header>

      <AppShell.Navbar className={styles.navbar} p={0}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">DN</span>
          <span>
            <span className={styles.brandName}>{brandName}</span>
            <span className={styles.brandMeta}>{brandMeta}</span>
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
          <ul className={styles.topLevel}>
            {sidebarConfig.items.filter((item) => item.children || matchesQuery(item, normalizedQuery)).map(renderItem)}
          </ul>
        </nav>
        <footer className={styles.footer}>
          <div className={styles.profile}>
            <span className={styles.avatar} aria-hidden="true">{profileAvatar ?? profileName.slice(0, 1).toUpperCase()}</span>
            <span className={styles.profileText}>
              <span className={styles.profileName}>{profileName}</span>
              <span className={styles.profileMeta}>{profileMeta}</span>
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

export function AppShellLayout(props: Readonly<AppShellLayoutProps>) {
  return (
    <ShellProvider>
      <AppShellFrame {...props} />
    </ShellProvider>
  )
}

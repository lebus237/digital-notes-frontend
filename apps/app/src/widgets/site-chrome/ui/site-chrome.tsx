import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBook2,
  IconBookmark,
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconFileDescription,
  IconLibrary,
  IconLogout,
  IconMoon,
  IconPencil,
  IconSearch,
  IconSparkles,
  IconSun,
  IconUpload,
  IconUserCircle,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { NOTE_TYPES } from '@/pages/catalogue/types'
import { logoutStudent, resendVerification } from '@/shared/api/endpoints/auth'
import { useSession } from '@/shared/auth/use-session'
import styles from './site-chrome.module.scss'

const CONTRIBUTOR_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_CONTRIBUTOR_URL ??
  'http://localhost:3002'

const NOTE_TYPE_ICON: Record<string, typeof IconBook2> = {
  LECTURE_NOTES: IconBook2,
  SUMMARY: IconSparkles,
  REVISION: IconCheck,
  PAST_EXAM: IconFileDescription,
  EXERCISES: IconPencil,
}

export function SiteHeader() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [opened, setOpened] = useState(false)
  const [verificationState, setVerificationState] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  const session = useSession()
  const displayName = session.user?.fullName || session.user?.email || 'My account'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'S'

  const signOut = async () => {
    await logoutStudent()
    setOpened(false)
    void navigate({ to: '/' })
  }

  const resendEmail = async () => {
    setVerificationState('sending')
    try {
      await resendVerification()
      setVerificationState('sent')
    } catch {
      setVerificationState('error')
    }
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const q = search.trim()
    navigate({ to: '/browse', search: q ? { q } : {} })
    setOpened(false)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.utilityBar}>
          <Container size="xl">
            <Group justify="space-between" h={34} wrap="nowrap" gap="md">
              <Group gap={8} wrap="nowrap">
                <IconCheck size={13} stroke={2.2} />
                <Text className={styles.utilityText}>
                  Pilot access · every document is free
                </Text>
              </Group>
              <Group gap="lg" wrap="nowrap" visibleFrom="sm">
                <a
                  className={styles.utilityLink}
                  href={CONTRIBUTOR_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  For contributors
                </a>
                <a className={styles.utilityLink} href="/#how-it-works">
                  How it works
                </a>
              </Group>
            </Group>
          </Container>
        </div>

        <Container size="xl" className={styles.headerInner}>
          <Group h={78} justify="space-between" wrap="nowrap" gap="lg">
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>DN</span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>DigitalNotes</span>
                <span className={styles.brandMeta}>The course library</span>
              </span>
            </Link>

            <Group gap={2} className={styles.primaryNav} visibleFrom="lg">
              <Link to="/browse" className={styles.navLink}>
                Explore
              </Link>
              <Link to="/" hash="universities" className={styles.navLink}>
                Universities
              </Link>
              <Menu trigger="hover" openDelay={80} closeDelay={120} radius="md">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    className={styles.navMenuButton}
                    rightSection={<IconChevronDown size={13} />}
                  >
                    Document types
                  </Button>
                </Menu.Target>
                <Menu.Dropdown className={styles.menuDropdown}>
                  {NOTE_TYPES.map((type) => {
                    const Icon = NOTE_TYPE_ICON[type.value] ?? IconFileDescription
                    return (
                      <Menu.Item
                        key={type.value}
                        leftSection={<Icon size={16} stroke={1.7} />}
                        onClick={() => navigate({ to: '/browse', search: { type: type.value } })}
                      >
                        <Text size="sm" fw={600}>
                          {type.label}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {type.description}
                        </Text>
                      </Menu.Item>
                    )
                  })}
                </Menu.Dropdown>
              </Menu>
            </Group>

            <form className={styles.headerSearch} onSubmit={submitSearch}>
              <IconSearch size={16} className={styles.headerSearchIcon} />
              <input
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search courses or notes…"
                aria-label="Search the catalogue"
              />
              <button type="submit" aria-label="Search">
                <IconArrowRight size={15} />
              </button>
            </form>

            <Group gap="sm" wrap="nowrap" visibleFrom="md">
              <Tooltip label={dark ? 'Light mode' : 'Dark mode'} withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  aria-label="Toggle color scheme"
                  onClick={() => setColorScheme(dark ? 'light' : 'dark')}
                >
                  {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
              </Tooltip>
              <a
                href={CONTRIBUTOR_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.contributeLink}
              >
                <IconUpload size={15} />
                Contribute
              </a>
              {session.ready && !session.authenticated && (
                <>
                  <Link to="/login" className={styles.signInLink}>
                    Sign in
                  </Link>
                  <Button component={Link} to="/register" size="sm" radius="md" color="brand">
                    Join free
                  </Button>
                </>
              )}

              {session.authenticated && (
                <Menu shadow="md" width={220} position="bottom-end" radius="md">
                  <Menu.Target>
                    <Button
                      variant="light"
                      color="brand"
                      size="sm"
                      radius="md"
                      leftSection={
                        <Avatar size={24} radius="xl" color="brand">
                          {initial}
                        </Avatar>
                      }
                      rightSection={<IconChevronDown size={13} />}
                      className={styles.accountButton}
                    >
                      <Text size="xs" fw={700} lineClamp={1} className={styles.accountName}>
                        {displayName}
                      </Text>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>{session.user?.email ?? 'Student account'}</Menu.Label>
                    <Menu.Item
                      leftSection={<IconLibrary size={16} />}
                      onClick={() => navigate({ to: '/library' })}
                    >
                      My library
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconUserCircle size={16} />}
                      onClick={() => navigate({ to: '/profile' })}
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={16} />}
                      onClick={signOut}
                    >
                      Sign out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}

            </Group>

            <Burger
              opened={opened}
              onClick={() => setOpened((value) => !value)}
              hiddenFrom="md"
              size="sm"
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>
      </header>

      {session.authenticated && session.user?.emailVerified === false && (
        <div className={styles.verifyBar}>
          <Container size="xl">
            <Group justify="space-between" gap="md" wrap="wrap" py={9}>
              <Group gap={8} wrap="nowrap" align="flex-start">
                <IconAlertCircle size={16} className={styles.verifyIcon} />
                <Text size="xs" className={styles.verifyText}>
                  <strong>Verify your email.</strong> Confirm your address to secure your
                  account and enable account recovery.
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                {verificationState === 'sent' && (
                  <Text size="xs" className={styles.verifySuccess}>
                    Verification link sent
                  </Text>
                )}
                {verificationState === 'error' && (
                  <Text size="xs" className={styles.verifyError}>
                    Could not send the link
                  </Text>
                )}
                <Button
                  variant="subtle"
                  color="brand"
                  size="compact-sm"
                  loading={verificationState === 'sending'}
                  onClick={resendEmail}
                >
                  Resend link
                </Button>
              </Group>
            </Group>
          </Container>
        </div>
      )}

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="right"
        size="sm"
        title="Menu"
        hiddenFrom="md"
        classNames={{ body: styles.drawerBody }}
      >
        <Stack gap="lg">
          <form className={styles.drawerSearch} onSubmit={submitSearch}>
            <IconSearch size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search courses or notes…"
              aria-label="Search the catalogue"
            />
          </form>

          {session.ready && !session.authenticated && (
            <Group grow>
              <Button
                component={Link}
                to="/login"
                variant="light"
                color="brand"
                onClick={() => setOpened(false)}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/register"
                color="brand"
                onClick={() => setOpened(false)}
              >
                Join free
              </Button>
            </Group>
          )}

          {session.authenticated && (
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Signed in as {session.user?.fullName ?? session.user?.email ?? 'Student'}
              </Text>
              <Link
                to="/library"
                className={styles.drawerLink}
                onClick={() => setOpened(false)}
              >
                My library
              </Link>
              <Link
                to="/profile"
                className={styles.drawerLink}
                onClick={() => setOpened(false)}
              >
                My profile
              </Link>
              <Button variant="subtle" color="gray" justify="flex-start" onClick={signOut}>
                Sign out
              </Button>
            </Stack>
          )}

          <Stack gap={4}>
            <Link
              to="/browse"
              className={styles.drawerLink}
              onClick={() => setOpened(false)}
            >
              Explore the library
            </Link>
            <Link
              to="/"
              hash="universities"
              className={styles.drawerLink}
              onClick={() => setOpened(false)}
            >
              Universities
            </Link>
            <a href="/#how-it-works" className={styles.drawerLink} onClick={() => setOpened(false)}>
              How it works
            </a>
          </Stack>

          <Divider />

          <div>
            <Text className={styles.drawerLabel}>Document types</Text>
            <Stack gap={2} mt="xs">
              {NOTE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={styles.drawerType}
                  onClick={() => {
                    navigate({ to: '/browse', search: { type: type.value } })
                    setOpened(false)
                  }}
                >
                  {type.label}
                  <IconArrowRight size={14} />
                </button>
              ))}
            </Stack>
          </div>

          <Button
            component="a"
            href={CONTRIBUTOR_URL}
            target="_blank"
            rel="noreferrer"
            variant="light"
            color="brand"
            leftSection={<IconUpload size={16} />}
          >
            Contribute notes
          </Button>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Appearance
            </Text>
            <ActionIcon
              variant="light"
              color="gray"
              size="lg"
              aria-label="Toggle color scheme"
              onClick={() => setColorScheme(dark ? 'light' : 'dark')}
            >
              {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Group>
        </Stack>
      </Drawer>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container size="xl">
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Group gap={10}>
              <span className={styles.footerMark}>DN</span>
              <div>
                <Text className={styles.footerName}>DigitalNotes</Text>
                <Text className={styles.footerTagline}>The course library</Text>
              </div>
            </Group>
            <Text className={styles.footerBlurb}>
              A calmer, better organised place to find the notes that match your course. Every
              document is reviewed before it reaches the library.
            </Text>
            <Group gap={8}>
              <span className={styles.footerPill}>
                <IconCheck size={12} /> Reviewed documents
              </span>
              <span className={styles.footerPill}>
                <IconCheck size={12} /> Free during pilot
              </span>
            </Group>
          </div>

          <div className={styles.footerColumns}>
            <div>
              <Text className={styles.footerColumnTitle}>Explore</Text>
              <Link to="/browse" className={styles.footerLink}>
                All documents
              </Link>
              {NOTE_TYPES.slice(0, 3).map((type) => (
                <Link
                  key={type.value}
                  to="/browse"
                  search={{ type: type.value } as never}
                  className={styles.footerLink}
                >
                  {type.label}
                </Link>
              ))}
            </div>

            <div>
              <Text className={styles.footerColumnTitle}>Catalogue</Text>
              <Link to="/" hash="universities" className={styles.footerLink}>
                Universities
              </Link>
              <Link to="/" hash="departments" className={styles.footerLink}>
                Departments
              </Link>
              <Link to="/" hash="how-it-works" className={styles.footerLink}>
                How it works
              </Link>
            </div>

            <div>
              <Text className={styles.footerColumnTitle}>Community</Text>
              <a
                href={CONTRIBUTOR_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                Contribute notes
              </a>
              <a
                href={CONTRIBUTOR_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                Contributor space
              </a>
              <a href="mailto:hello@digitalnotes.app" className={styles.footerLink}>
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <Text size="xs">© 2026 DigitalNotes. Built for focused study.</Text>
          <Group gap="lg">
            <Text size="xs">Pilot access</Text>
            <Text size="xs">Reviewed by the DigitalNotes team</Text>
          </Group>
        </div>
      </Container>
    </footer>
  )
}

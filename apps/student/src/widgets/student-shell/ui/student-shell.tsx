import {
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Text,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconBook2,
  IconCompass,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { logoutStudent, resendVerification } from '@/shared/api/endpoints/auth'
import { useSession } from '@/shared/auth/use-session'
import styles from './student-shell.module.scss'

const PUBLIC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_PUBLIC_URL ?? 'http://localhost:3000'

export function StudentShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useSession()
  const [verificationState, setVerificationState] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  const active = location.pathname.includes('/profile') ? 'profile' : 'library'
  const displayName = session.user?.fullName || session.user?.email || 'Student'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'S'

  const signOut = async () => {
    await logoutStudent()
    void navigate({ to: '/login' })
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

  return (
    <div className={styles.app}>
      <header className={styles.topBar}>
        <Container size="sm" className={styles.topInner}>
          <Box className={styles.brand}>
            <span className={styles.brandMark}>DN</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>DigitalNotes</span>
              <span className={styles.brandMeta}>Student library</span>
            </span>
          </Box>
          <Avatar size={32} radius="xl" color="brand">
            {initial}
          </Avatar>
        </Container>
      </header>

      {session.authenticated && session.user?.emailVerified === false && (
        <div className={styles.verifyBar}>
          <Container size="sm">
            <Group justify="space-between" gap="sm" wrap="nowrap" py={8}>
              <Group gap={8} wrap="nowrap" align="flex-start">
                <IconAlertCircle size={16} className={styles.verifyIcon} />
                <Text size="xs" className={styles.verifyText}>
                  <strong>Verify your email</strong>
                  <br />
                  Secure your account and enable recovery.
                </Text>
              </Group>
              <Button
                size="compact-sm"
                variant="light"
                color="brand"
                loading={verificationState === 'sending'}
                onClick={resendEmail}
              >
                {verificationState === 'sent' ? 'Sent' : 'Resend'}
              </Button>
            </Group>
          </Container>
        </div>
      )}

      <main className={styles.main}>{children}</main>

      <nav className={styles.bottomBar}>
        <Container size="sm" className={styles.bottomInner}>
          <Link to="/" className={active === 'library' ? styles.navActive : styles.navItem}>
            <IconBook2 size={21} strokeWidth={1.7} />
            <span>Library</span>
          </Link>
          <a href={PUBLIC_URL} className={styles.navItem}>
            <IconCompass size={21} strokeWidth={1.7} />
            <span>Explore</span>
          </a>
          <Link
            to="/profile"
            className={active === 'profile' ? styles.navActive : styles.navItem}
          >
            <IconUserCircle size={21} strokeWidth={1.7} />
            <span>Profile</span>
          </Link>
          <button type="button" className={styles.navItem} onClick={signOut}>
            <IconLogout size={21} strokeWidth={1.7} />
            <span>Sign out</span>
          </button>
        </Container>
      </nav>
    </div>
  )
}

import { Button, Group, Text, ThemeIcon } from '@mantine/core'
import {
  IconArrowLeft,
  IconBookmark,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { logoutStudent } from '@/shared/api/endpoints/auth'
import { getInitials } from '@/pages/catalogue/types'
import { academicLabel, type StudentProfile } from './types'
import styles from './account.module.scss'

export function AccountSidebar({
  profile,
  active,
}: Readonly<{ profile: StudentProfile | undefined; active: 'library' | 'profile' }>) {
  const navigate = useNavigate()
  const name = profile?.fullName || profile?.email || 'Student'

  const signOut = async () => {
    await logoutStudent()
    void navigate({ to: '/' })
  }

  return (
    <aside className={styles.accountSidebar}>
      <div className={styles.identity}>
        <ThemeIcon size={54} radius="xl" color="brand" variant="light">
          <Text fw={700} size="md">
            {getInitials(name)}
          </Text>
        </ThemeIcon>
        <div className={styles.identityCopy}>
          <Text fw={700} className={styles.identityName} lineClamp={1}>
            {name}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2}>
            {profile?.email ?? 'Student account'}
          </Text>
        </div>
      </div>

      <div className={styles.programme}>
        <Text className={styles.sidebarLabel}>Your programme</Text>
        <Text size="sm" fw={600} mt={4}>
          {academicLabel(profile)}
        </Text>
        {profile?.universityName && (
          <Text size="xs" c="dimmed" mt={4}>
            {profile.universityName}
          </Text>
        )}
      </div>

      <nav className={styles.accountNav}>
        <Link
          to="/library"
          className={active === 'library' ? styles.navActive : styles.navItem}
        >
          <IconBookmark size={16} />
          My library
        </Link>
        <Link
          to="/profile"
          className={active === 'profile' ? styles.navActive : styles.navItem}
        >
          <IconUserCircle size={16} />
          Profile
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        <Link to="/browse" className={styles.navItem}>
          <IconArrowLeft size={16} />
          Back to explore
        </Link>
        <Button
          variant="subtle"
          color="gray"
          size="sm"
          justify="flex-start"
          leftSection={<IconLogout size={16} />}
          onClick={signOut}
        >
          Sign out
        </Button>
      </div>
    </aside>
  )
}

export function AccountPageLoader() {
  return (
    <div className={styles.accountLoader}>
      <Text c="dimmed">Preparing your space…</Text>
    </div>
  )
}

export function SignInPrompt() {
  return (
    <div className={styles.signInPrompt}>
      <Text className={styles.promptIcon}>
        <IconBookmark size={26} />
      </Text>
      <Text fw={700} size="lg" mt="md">
        Your library starts with an account
      </Text>
      <Text size="sm" c="dimmed" mt={6} maw={420} ta="center">
        Sign in to save documents, keep your reading history and personalise the catalogue with
        your programme.
      </Text>
      <Group gap="sm" mt="lg">
        <Button component={Link} to="/login" search={{ redirect: '/library' } as never} color="brand">
          Sign in
        </Button>
        <Button component={Link} to="/register" variant="light" color="brand">
          Create an account
        </Button>
      </Group>
    </div>
  )
}

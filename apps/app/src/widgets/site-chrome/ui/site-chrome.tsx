import { ActionIcon, Container, Group, Text, Tooltip, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import styles from './site-chrome.module.scss'

export function SiteHeader() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <header className={styles.header}>
      <Container size="lg" h="100%">
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>DN</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>DigitalNotes</span>
              <span className={styles.brandMeta}>Course material library</span>
            </span>
          </Link>

          <Group gap="sm" wrap="nowrap">
            <Link to="/" className={styles.navLink}>
              Catalogue
            </Link>
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
          </Group>
        </Group>
      </Container>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container size="lg">
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Group gap="xs">
            <span className={styles.footerMark}>DN</span>
            <Text size="sm" fw={600}>
              DigitalNotes
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            A calmer place to find your course material.
          </Text>
        </Group>
      </Container>
    </footer>
  )
}

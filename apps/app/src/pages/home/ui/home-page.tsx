import { Container, Text, Title } from '@mantine/core'
import { NotesWorkspace } from '@/widgets/notes-workspace'
import styles from './home-page.module.scss'

export function HomePage() {
  return (
    <main className={styles.page}>
      <Container size="md">
        <header className={styles.header}>
          <Text c="dimmed" size="sm">DIGITALNOTES · YOUR NOTEBOOK</Text>
          <Title order={1}>A clear place for your notes</Title>
          <Text c="dimmed" maw={560}>
            Capture a thought, keep the details, and find it here when you need it.
          </Text>
        </header>
        <NotesWorkspace />
      </Container>
    </main>
  )
}

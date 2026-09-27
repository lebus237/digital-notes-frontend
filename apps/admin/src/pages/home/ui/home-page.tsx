import { Container, Text, Title } from '@mantine/core'
import { NoteReview } from '@/widgets/note-review'
import styles from './home-page.module.scss'

export function HomePage() {
  return (
    <main className={styles.page}>
      <Container size="xl">
        <header className={styles.header}>
          <div>
            <Text c="dimmed" size="sm">DIGITALNOTES · ADMINISTRATION</Text>
            <Title order={1}>Note review</Title>
          </div>
          <Text c="dimmed" maw={420}>
            Review community notes, update their status, or remove items from the queue.
          </Text>
        </header>
        <NoteReview />
      </Container>
    </main>
  )
}

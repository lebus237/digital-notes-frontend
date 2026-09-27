import { Button, Container, Stack, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import styles from './index.module.scss'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <Container size="sm" className={styles.page}>
      <Stack align="flex-start" gap="md">
        <Title order={1}>Contributor</Title>
        <Button>Get started</Button>
      </Stack>
    </Container>
  )
}

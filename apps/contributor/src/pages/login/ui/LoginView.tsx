import { Container, Text, Title } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import styles from './login-view.module.scss'
import { LoginForm } from './components/LoginForm'

export default function LoginView() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <Container size="xs">
        <header className={styles.header}>
          <Text c="dimmed" size="sm">DIGITALNOTES · CONTRIBUTOR</Text>
          <Title order={1}>Sign in</Title>
          <Text c="dimmed">Sign in with your contributor account to continue.</Text>
        </header>
        <LoginForm
          onSuccess={() => {
            void navigate({ to: '/' })
          }}
        />
      </Container>
    </main>
  )
}

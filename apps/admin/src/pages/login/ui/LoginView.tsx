import { useNavigate } from '@tanstack/react-router'
import { ThemeSwitcher } from '@/features/switch-theme'
import { LoginForm } from './components/LoginForm'
import styles from './login-view.module.scss'

export default function LoginView() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.theme}>
        <ThemeSwitcher />
      </div>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <LoginForm
          onSuccess={() => {
            void navigate({ to: '/' })
          }}
        />
      </div>
    </main>
  )
}

import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconCheck, IconLock, IconMail, IconPhone, IconUser } from '@tabler/icons-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { loginStudent, registerStudent, type LoginPayload } from '@/shared/api/endpoints/auth'
import { useSession } from '@/shared/auth/use-session'
import styles from './auth.module.scss'

const BENEFITS = [
  'Save documents to your personal library.',
  'Pick up exactly where you stopped reading.',
  'Personalise the catalogue with your programme.',
]

export function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })
  const { authenticated, ready } = useSession()
  const redirect = typeof search.redirect === 'string' ? search.redirect : '/library'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (ready && authenticated) {
      void navigate({ to: redirect as never })
    }
  }, [authenticated, navigate, ready, redirect])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setSubmitting(true)
    try {
      await loginStudent({ email: email.trim(), password })
      void navigate({ to: redirect as never })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to open your personal library, save documents and keep your study trail."
      footer={
        <Text size="sm" c="dimmed" ta="center">
          New to DigitalNotes?{' '}
          <Link to="/register" className={styles.inlineLink}>
            Create a free account
          </Link>
        </Text>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        {error && <div className={styles.error}>{error}</div>}
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconMail size={16} />}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          leftSection={<IconLock size={16} />}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth size="md" color="brand" radius="md" loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/register' })
  const { authenticated, ready } = useSession()
  const redirect = typeof search.redirect === 'string' ? search.redirect : '/profile'
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (ready && authenticated) {
      void navigate({ to: redirect as never })
    }
  }, [authenticated, navigate, ready, redirect])

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (values.fullName.trim().length < 2) {
      setError('Enter your full name.')
      return
    }
    if (!values.email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (values.phoneNumber.trim().length < 8) {
      setError('Enter a valid phone number.')
      return
    }
    if (
      values.password.length < 6 ||
      !/[a-z]/.test(values.password) ||
      !/[A-Z]/.test(values.password) ||
      !/\d/.test(values.password)
    ) {
      setError('Use at least 6 characters with one uppercase letter, one lowercase letter and one number.')
      return
    }

    setSubmitting(true)
    try {
      await registerStudent({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      })
      void navigate({ to: '/profile' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Account creation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="One free account for your course library, saved documents and reading history."
      footer={
        <Text size="sm" c="dimmed" ta="center">
          Already have an account?{' '}
          <Link to="/login" className={styles.inlineLink}>
            Sign in
          </Link>
        </Text>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        {error && <div className={styles.error}>{error}</div>}
        <TextInput
          label="Full name"
          placeholder="Your name"
          leftSection={<IconUser size={16} />}
          value={values.fullName}
          onChange={(event) => update('fullName', event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="name"
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconMail size={16} />}
          value={values.email}
          onChange={(event) => update('email', event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="email"
        />
        <TextInput
          label="Phone number"
          placeholder="6XX XXX XXX"
          leftSection={<IconPhone size={16} />}
          value={values.phoneNumber}
          onChange={(event) => update('phoneNumber', event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="tel"
        />
        <PasswordInput
          label="Password"
          placeholder="At least 6 characters"
          leftSection={<IconLock size={16} />}
          value={values.password}
          onChange={(event) => update('password', event.currentTarget.value)}
          size="md"
          radius="md"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth size="md" color="brand" radius="md" loading={submitting}>
          Create my account
        </Button>
        <Text size="xs" c="dimmed" ta="center">
          Free during the pilot. No payment details required.
        </Text>
      </form>
    </AuthShell>
  )
}

function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: Readonly<{
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}>) {
  return (
    <main className={styles.page}>
      <Container size="xl">
        <div className={styles.grid}>
          <section className={styles.editorial}>
            <Link to="/" className={styles.back}>
              <IconArrowLeft size={15} /> Back to the library
            </Link>
            <div className={styles.editorialCopy}>
              <Text className={styles.kicker}>THE STUDENT LIBRARY</Text>
              <Title className={styles.editorialTitle}>
                Your semester,
                <br />
                <em>organised.</em>
              </Title>
              <Text className={styles.editorialText}>
                Save the documents that matter, find them again in seconds and build a study
                space that follows your programme.
              </Text>
              <div className={styles.benefits}>
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className={styles.benefit}>
                    <span>
                      <IconCheck size={14} />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            <Paper className={styles.noteStack} radius="md">
              <div className={styles.noteSheet}>
                <span>INF101 · LECTURE NOTES</span>
                <strong>Complexité algorithmique</strong>
                <i />
                <i />
                <i />
              </div>
              <div className={styles.noteSheetBack} />
            </Paper>
            <Text className={styles.editorialFoot}>DigitalNotes · The course library</Text>
          </section>

          <section className={styles.formPanel}>
            <div className={styles.formWrap}>
              <div className={styles.formHeader}>
                <Title order={1} className={styles.formTitle}>
                  {title}
                </Title>
                <Text size="sm" c="dimmed" mt={8}>
                  {subtitle}
                </Text>
              </div>
              {children}
              <div className={styles.formFooter}>{footer}</div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}

export type { LoginPayload }

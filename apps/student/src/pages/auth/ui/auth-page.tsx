import {
  Alert,
  Button,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconCheck, IconLock, IconMail, IconPhone, IconUser } from '@tabler/icons-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  forgotPassword,
  loginStudent,
  registerStudent,
  resetPassword,
} from '@/shared/api/endpoints/auth'
import { useSession } from '@/shared/auth/use-session'
import styles from './auth.module.scss'

export function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })
  const { authenticated, ready } = useSession()
  const redirect = typeof search.redirect === 'string' ? search.redirect : '/'
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
      setError('Enter your email and password.')
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
    <MobileAuthShell
      title="Welcome back"
      subtitle="Sign in to open your library."
      footer={
        <Text size="sm" c="dimmed" ta="center">
          New here?{' '}
          <Link to="/register" className={styles.inlineLink}>
            Create an account
          </Link>
        </Text>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        {search.notice === 'password-changed' && (
          <Alert color="green" icon={<IconCheck size={16} />}>
            Your password has been changed. Sign in with your new password.
          </Alert>
        )}
        {error && <div className={styles.error}>{error}</div>}
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconMail size={16} />}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          size="lg"
          radius="md"
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          leftSection={<IconLock size={16} />}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          size="lg"
          radius="md"
          autoComplete="current-password"
        />
        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.inlineLink}>
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth size="lg" color="brand" radius="md" loading={submitting}>
          Sign in
        </Button>
      </form>
    </MobileAuthShell>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { authenticated, ready } = useSession()
  const [values, setValues] = useState({ fullName: '', email: '', phoneNumber: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (ready && authenticated) {
      void navigate({ to: '/' })
    }
  }, [authenticated, navigate, ready])

  const update = (key: keyof typeof values, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (values.fullName.trim().length < 2) return setError('Enter your full name.')
    if (!values.email.includes('@')) return setError('Enter a valid email address.')
    if (values.phoneNumber.trim().length < 8) return setError('Enter a valid phone number.')
    if (
      values.password.length < 6 ||
      !/[a-z]/.test(values.password) ||
      !/[A-Z]/.test(values.password) ||
      !/\d/.test(values.password)
    ) {
      return setError('Use at least 6 characters with an uppercase, a lowercase and a number.')
    }
    setSubmitting(true)
    try {
      await registerStudent({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      })
      void navigate({ to: '/' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Account creation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileAuthShell
      title="Create your account"
      subtitle="Your personal course library, on the go."
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
          size="lg"
          radius="md"
          autoComplete="name"
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconMail size={16} />}
          value={values.email}
          onChange={(event) => update('email', event.currentTarget.value)}
          size="lg"
          radius="md"
          autoComplete="email"
        />
        <TextInput
          label="Phone number"
          placeholder="6XX XXX XXX"
          leftSection={<IconPhone size={16} />}
          value={values.phoneNumber}
          onChange={(event) => update('phoneNumber', event.currentTarget.value)}
          size="lg"
          radius="md"
          autoComplete="tel"
        />
        <PasswordInput
          label="Password"
          placeholder="At least 6 characters"
          leftSection={<IconLock size={16} />}
          value={values.password}
          onChange={(event) => update('password', event.currentTarget.value)}
          size="lg"
          radius="md"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth size="lg" color="brand" radius="md" loading={submitting}>
          Create account
        </Button>
      </form>
    </MobileAuthShell>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.includes('@')) return setError('Enter the email linked to your account.')
    setSubmitting(true)
    try {
      const response = await forgotPassword({ email: email.trim() })
      if (response?.error || (response?.message && !response?.data)) {
        throw new Error(response?.error?.message ?? response?.message)
      }
      setMessage(
        response?.data?.message ?? 'If an account exists, a reset link has been sent.'
      )
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Request failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileAuthShell
      title="Reset password"
      subtitle="We will send a secure link to your email."
      footer={
        <Text size="sm" c="dimmed" ta="center">
          <Link to="/login" className={styles.inlineLink}>
            Back to sign in
          </Link>
        </Text>
      }
    >
      {message ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <IconMail size={24} />
          </div>
          <Text size="sm" c="dimmed" mt="sm" ta="center" lh={1.7}>
            {message}
          </Text>
          <Button component={Link} to="/login" variant="light" color="brand" mt="lg">
            Back to sign in
          </Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          {error && <div className={styles.error}>{error}</div>}
          <TextInput
            label="Email"
            placeholder="you@example.com"
            leftSection={<IconMail size={16} />}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            size="lg"
            radius="md"
            autoComplete="email"
          />
          <Button type="submit" fullWidth size="lg" color="brand" radius="md" loading={submitting}>
            Send reset link
          </Button>
        </form>
      )}
    </MobileAuthShell>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/reset-password' })
  const token = typeof search.token === 'string' ? search.token : ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!token) return setError('This link is incomplete. Request a new one.')
    if (password !== confirmation) return setError('Passwords do not match.')
    if (
      password.length < 6 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return setError('Use at least 6 characters with an uppercase, a lowercase and a number.')
    }
    setSubmitting(true)
    try {
      await resetPassword({ token, password })
      setDone(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Password reset failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileAuthShell
      title={done ? 'Password updated' : 'Choose a new password'}
      subtitle={done ? 'Sign in again with your new password.' : 'Pick a strong password.'}
      footer={
        <Text size="sm" c="dimmed" ta="center">
          <Link to="/login" className={styles.inlineLink}>
            Back to sign in
          </Link>
        </Text>
      }
    >
      {done ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <IconCheck size={24} />
          </div>
          <Button color="brand" mt="lg" onClick={() => navigate({ to: '/login' })}>
            Sign in
          </Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          {!token && <Alert color="red">This reset link is incomplete.</Alert>}
          {error && <div className={styles.error}>{error}</div>}
          <PasswordInput
            label="New password"
            leftSection={<IconLock size={16} />}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            size="lg"
            radius="md"
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm password"
            leftSection={<IconLock size={16} />}
            value={confirmation}
            onChange={(event) => setConfirmation(event.currentTarget.value)}
            size="lg"
            radius="md"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            size="lg"
            color="brand"
            radius="md"
            loading={submitting}
            disabled={!token}
          >
            Update password
          </Button>
        </form>
      )}
    </MobileAuthShell>
  )
}

function MobileAuthShell({
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
      <div className={styles.brand}>
        <span className={styles.brandMark}>DN</span>
        <span className={styles.brandName}>DigitalNotes</span>
      </div>
      <div className={styles.card}>
        <Title order={1} className={styles.title}>
          {title}
        </Title>
        <Text size="sm" c="dimmed" mt={6}>
          {subtitle}
        </Text>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>{footer}</div>
      </div>
    </main>
  )
}

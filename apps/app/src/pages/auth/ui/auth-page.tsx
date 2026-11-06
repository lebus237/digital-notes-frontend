import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconCheck,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from '@tabler/icons-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  forgotPassword,
  loginStudent,
  refreshCurrentUser,
  registerStudent,
  resetPassword,
  verifyEmail,
} from '@/shared/api/endpoints/auth'
import { useSession } from '@/shared/auth/use-session'
import styles from './auth.module.scss'

const BENEFITS = [
  'Save documents to your personal library.',
  'Pick up exactly where you stopped reading.',
  'Personalise the catalogue with your programme.',
]

/*
 * Email verification links are single-use. Cache the request by token so a
 * StrictMode double-effect (or a remount) cannot consume the same link twice.
 */
const verifyRequests = new Map<string, Promise<unknown>>()

function verifyEmailOnce(token: string): Promise<unknown> {
  let request = verifyRequests.get(token)
  if (!request) {
    request = verifyEmail(token)
    verifyRequests.set(token, request)
  }
  return request
}

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
        <Group justify="flex-end" mt={-8}>
          <Link to="/forgot-password" className={styles.inlineLink} style={{ fontSize: '0.78rem' }}>
            Forgot your password?
          </Link>
        </Group>
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

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.includes('@')) {
      setError('Enter the email address linked to your account.')
      return
    }
    setSubmitting(true)
    try {
      const response = await forgotPassword({ email: email.trim() })
      if (response?.error || (response?.message && !response?.data)) {
        throw new Error(response?.error?.message ?? response?.message)
      }
      setMessage(
        response?.data?.message ??
          'If an account exists, a password reset link has been sent.'
      )
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Request failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email. If it exists, we will send a secure link to choose a new password."
      footer={
        <Text size="sm" c="dimmed" ta="center">
          Remember your password?{' '}
          <Link to="/login" className={styles.inlineLink}>
            Back to sign in
          </Link>
        </Text>
      }
    >
      {message ? (
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>
            <IconMail size={24} />
          </div>
          <Title order={2} className={styles.successTitle}>
            Check your inbox
          </Title>
          <Text size="sm" c="dimmed" mt={8} ta="center" lh={1.7}>
            {message}
          </Text>
          <Text size="xs" c="dimmed" mt="sm" ta="center">
            The link expires in one hour. Check your spam folder if it does not arrive.
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
            size="md"
            radius="md"
            autoComplete="email"
          />
          <Button type="submit" fullWidth size="md" color="brand" radius="md" loading={submitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
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
    if (!token) {
      setError('This reset link is missing its token. Request a new link.')
      return
    }
    if (password !== confirmation) {
      setError('The two passwords do not match.')
      return
    }
    if (
      password.length < 6 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setError('Use at least 6 characters with one uppercase letter, one lowercase letter and one number.')
      return
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
    <AuthShell
      title={done ? 'Password updated' : 'Choose a new password'}
      subtitle={
        done
          ? 'Your password has been changed. Sign in with your new credentials to reopen your library.'
          : 'Choose a strong password for your DigitalNotes account.'
      }
      footer={
        <Text size="sm" c="dimmed" ta="center">
          <Link to="/login" className={styles.inlineLink}>
            Back to sign in
          </Link>
        </Text>
      }
    >
      {done ? (
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>
            <IconCheck size={24} />
          </div>
          <Text size="sm" c="dimmed" ta="center" lh={1.7}>
            Your session has been reset for security. Use your new password the next time you
            sign in.
          </Text>
          <Button
            color="brand"
            mt="lg"
            onClick={() => navigate({ to: '/login' })}
          >
            Sign in
          </Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          {!token && (
            <Alert color="red">
              This reset link is incomplete. Request a new password reset link.
            </Alert>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <PasswordInput
            label="New password"
            placeholder="At least 6 characters"
            leftSection={<IconLock size={16} />}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            size="md"
            radius="md"
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Repeat your new password"
            leftSection={<IconLock size={16} />}
            value={confirmation}
            onChange={(event) => setConfirmation(event.currentTarget.value)}
            size="md"
            radius="md"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            size="md"
            color="brand"
            radius="md"
            loading={submitting}
            disabled={!token}
          >
            Update password
          </Button>
        </form>
      )}
    </AuthShell>
  )
}

export function VerifyEmailPage() {
  const search = useSearch({ from: '/verify-email' })
  const token = typeof search.token === 'string' ? search.token : ''
  const { authenticated } = useSession()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('This verification link is incomplete. Request a new link from your account.')
      return
    }

    verifyEmailOnce(token)
      .then(async () => {
        await refreshCurrentUser().catch(() => undefined)
        setStatus('success')
      })
      .catch((verifyError) => {
        setStatus('error')
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : 'This verification link is invalid or has expired.'
        )
      })
  }, [token])

  return (
    <AuthShell
      title={status === 'success' ? 'Email verified' : 'Verify your email'}
      subtitle={
        status === 'success'
          ? 'Your email is confirmed. Your DigitalNotes account is now fully secured.'
          : 'We are confirming the email address linked to your student account.'
      }
      footer={
        <Text size="sm" c="dimmed" ta="center">
          <Link to="/login" className={styles.inlineLink}>
            Back to sign in
          </Link>
        </Text>
      }
    >
      {status === 'loading' && (
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>
            <IconMail size={24} />
          </div>
          <Text size="sm" c="dimmed" mt="md" ta="center">
            Checking your verification link…
          </Text>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>
            <IconCheck size={24} />
          </div>
          <Text size="sm" c="dimmed" mt="md" ta="center" lh={1.7}>
            You can now return to your library. A verified email also lets you recover your
            account more safely.
          </Text>
          <Button
            component={Link}
            to={authenticated ? '/library' : '/login'}
            color="brand"
            mt="lg"
          >
            {authenticated ? 'Open my library' : 'Sign in'}
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.successPanel}>
          <div className={styles.errorIcon}>
            <IconMail size={24} />
          </div>
          <Text size="sm" c="dimmed" mt="md" ta="center" lh={1.7}>
            {error}
          </Text>
          <Button component={Link} to="/profile" variant="light" color="brand" mt="lg">
            Resend verification link
          </Button>
        </div>
      )}
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



import { Alert, Button } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'
import { FormField, FormWrapper } from '@digitalnotes/core'
import { login } from '@/pages/login/model/login'
import styles from './login-form.module.scss'

type LoginFormProps = {
  onSuccess: () => void
}

type LoginValues = {
  email: string
  password: string
}

export const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  } satisfies LoginValues,
  validators: {
    onSubmit: z.object({
      email: z.email('Enter a valid email address.'),
      password: z.string().min(6, 'Use at least 6 characters.'),
    }),
  },
})

export function LoginForm({ onSuccess }: Readonly<LoginFormProps>) {
  const [error, setError] = useState('')

  async function handleSubmit(value: LoginValues) {
    setError('')
    try {
      await login({ email: value.email.trim(), password: value.password })
      onSuccess()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed. Try again.')
    }
  }

  return (
    <FormWrapper formOptions={formOpts} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Email
          name="email"
          placeholder="Email address"
          size="lg"
        />
        <FormField.Password
          name="password"
          placeholder="Password"
          size="lg"
        />
        <Button type="submit" fullWidth size="lg" className={styles.submit}>
          Sign in
        </Button>
      </div>
    </FormWrapper>
  )
}

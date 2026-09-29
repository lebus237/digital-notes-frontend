import { Alert, Button, Stack, TextInput } from '@mantine/core'
import { useState, type SubmitEvent } from 'react'
import { login } from '@/pages/login/model/login'
import styles from './login-form.module.scss'

type LoginFormProps = {
  onSuccess: () => void
}

import { formOptions } from '@tanstack/react-form';
import { z } from 'zod';
import { FormWrapper, FormField, FormComponent } from '@digitalnotes/core'

export const formOpts = formOptions({
  validators: {
    onSubmit: z.object({ email: z.email(), password: z.string().min(6) }),
  },
});


export function LoginForm({ onSuccess }: Readonly<LoginFormProps>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailError = email.trim() !== '' && !/^\S+@\S+\.\S+$/.test(email.trim())
    ? 'Enter a valid email address.'
    : ''

  const canSubmit = email.trim() !== '' && password !== '' && !emailError && !isSubmitting

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setError('')

    try {
      await login({ email: email.trim(), password })
      onSuccess()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormWrapper formOptions={formOpts} onSubmit={handleSubmit}>
      <Stack>
        <FormField.Email
          name="email"
          placeholder="common.emailOrPhone"
        />
        <FormField.Password
          name="password"
          placeholder="common.password"
        />
          <FormComponent.SubmitButton label="action.submit" />
        </Stack>
    </FormWrapper>
  )
}

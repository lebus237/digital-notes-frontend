import { Alert, Button, Stack, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'

/**
 * Inline "signed in but wrong role" state. Rendered inside the app shell
 * instead of the protected content — never a redirect, so it can't loop.
 */
export function AccessDenied({
  title = 'Not authorized',
  message = 'This account does not have access to this area. Sign in with an account that has access.',
}: Readonly<{ title?: string; message?: string }>) {
  return (
    <Stack align="center" justify="center" gap="md" py="xl">
      <Title order={3}>{title}</Title>
      <Alert color="red" maw={480}>
        {message}
      </Alert>
      <Button component={Link} to="/logout">
        Sign out
      </Button>
    </Stack>
  )
}

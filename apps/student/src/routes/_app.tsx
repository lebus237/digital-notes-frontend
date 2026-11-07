import { createFileRoute, Navigate, Outlet, useLocation } from '@tanstack/react-router'
import { StudentShell } from '@/widgets/student-shell'
import { useSession } from '@/shared/auth/use-session'

export const Route = createFileRoute('/_app')({
  component: StudentAppLayout,
})

function StudentAppLayout() {
  const session = useSession()
  const location = useLocation()

  if (session.ready && !session.authenticated) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />
  }

  return (
    <StudentShell>
      <Outlet />
    </StudentShell>
  )
}

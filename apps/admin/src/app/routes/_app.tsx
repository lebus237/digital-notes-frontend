import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShellLayout } from '@/widgets/app-shell'

export const Route = createFileRoute('/_app')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AppShellLayout>
      <Outlet />
    </AppShellLayout>
  )
}

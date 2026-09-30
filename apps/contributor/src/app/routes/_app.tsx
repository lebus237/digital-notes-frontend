import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NotesProvider } from '@/entities/note'
import { AppShellLayout } from '@/widgets/app-shell'

export const Route = createFileRoute('/_app')({
  component: ContributorLayout,
})

function ContributorLayout() {
  return (
    <NotesProvider>
      <AppShellLayout>
        <Outlet />
      </AppShellLayout>
    </NotesProvider>
  )
}

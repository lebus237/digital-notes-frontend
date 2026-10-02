import { IconBook, IconBuilding, IconUsers } from '@tabler/icons-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShellLayout, type SidebarConfig } from '@digitalnotes/core'
import { ThemeSwitcher } from '@/features/switch-theme'

const sidebarConfig: SidebarConfig = {
  items: [
    {
      id: 'organisation',
      label: 'Organisation',
      to: '/organisation',
      icon: IconBuilding,
      keywords: ['organisation', 'universities', 'faculties'],
    },
    {
      id: 'courses',
      label: 'Courses',
      to: '/courses',
      icon: IconBook,
      keywords: ['courses', 'catalog'],
    },
    {
      id: 'employees',
      label: 'Employees',
      to: '/employees',
      icon: IconUsers,
      keywords: ['employees', 'staff'],
    },
  ],
}

export const Route = createFileRoute('/_app')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      brandName="DigitalNotes"
      brandMeta="Administration"
      profileName="Administrator"
      profileMeta="Review queue"
      headerEnd={<ThemeSwitcher />}
    >
      <Outlet />
    </AppShellLayout>
  )
}

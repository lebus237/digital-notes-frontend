import { IconBook, IconBuilding, IconClipboardCheck, IconUsers } from '@tabler/icons-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShellLayout, type SidebarConfig } from '@digitalnotes/core'
import { ThemeSwitcher } from '@/features/switch-theme'

const sidebarConfig: SidebarConfig = {
  items: [
    {
      id: 'catalogue',
      label: 'Catalogue',
      icon: IconBuilding,
      keywords: ['catalogue'],
      children: [
        { id: 'organisation', label: 'Organisation', to: '/organisation', icon: IconBuilding },
        { id: 'courses', label: 'Courses', to: '/courses', icon: IconBook },
        { id: 'employees', label: 'Employees', to: '/employees', icon: IconUsers },
      ],
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

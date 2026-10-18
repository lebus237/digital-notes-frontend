import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/organisation')({
  component: OrganisationLayout,
})

function OrganisationLayout() {
  return <Outlet />
}

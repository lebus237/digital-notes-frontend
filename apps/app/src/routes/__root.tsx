import '@mantine/core/styles.css'
import { ColorSchemeScript } from '@mantine/core'
import { AppProvider } from '@/app/providers'
import { SiteFooter, SiteHeader } from '@/widgets/site-chrome'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'DigitalNotes — Course notes library' },
      {
        name: 'description',
        content:
          'Browse universities, faculties, departments and courses to find approved course notes.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <AppProvider>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </AppProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

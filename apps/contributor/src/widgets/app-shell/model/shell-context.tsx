import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type ShellCrumb = {
  label: string
  to?: '/' | '/submit'
}

type ShellContextValue = {
  breadcrumbs: ShellCrumb[]
  setBreadcrumbs: (breadcrumbs: ShellCrumb[]) => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function ShellProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [breadcrumbs, setBreadcrumbsState] = useState<ShellCrumb[]>([])
  const setBreadcrumbs = useCallback((next: ShellCrumb[]) => {
    setBreadcrumbsState(next)
  }, [])
  const value = useMemo(() => ({ breadcrumbs, setBreadcrumbs }), [breadcrumbs, setBreadcrumbs])

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export function useShell() {
  const context = useContext(ShellContext)
  if (!context) {
    throw new Error('useShell must be used within ShellProvider')
  }
  return context
}

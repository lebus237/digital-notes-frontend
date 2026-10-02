import { IconX } from '@tabler/icons-react'
import { useEffect, type ReactNode } from 'react'
import { useShell, type ShellCrumb } from '../../app-shell/model/shell-context'
import styles from './page-container.module.scss'

type PagePanel = {
  opened: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

type PageContainerProps = {
  breadcrumbs: ShellCrumb[]
  actions?: ReactNode
  panel?: PagePanel
  children: ReactNode
}

export function PageContainer({ breadcrumbs, actions, panel, children }: Readonly<PageContainerProps>) {
  const { setBreadcrumbs } = useShell()
  const panelOpen = Boolean(panel?.opened)

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    return () => setBreadcrumbs([])
  }, [breadcrumbs, setBreadcrumbs])

  return (
    <div className={styles.frame}>
      <div className={`${styles.content} ${panelOpen ? styles.contentShifted : ''}`}>
        <header className={styles.actionBar}>{actions}</header>
        <div className={styles.body}>{children}</div>
      </div>
      <aside
        className={`${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
        aria-hidden={!panelOpen}
        {...(!panelOpen ? { inert: true } : {})}
      >
        <header className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>{panel?.title ?? 'Panel'}</h1>
          <button type="button" className={styles.closeButton} onClick={panel?.onClose} aria-label="Close panel">
            <IconX size={16} />
          </button>
        </header>
        <div className={styles.panelBody}>{panel?.children}</div>
      </aside>
    </div>
  )
}

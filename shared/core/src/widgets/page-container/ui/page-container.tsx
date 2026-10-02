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
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  panel?: PagePanel
  children: ReactNode
}

export function PageContainer({ breadcrumbs, title, description, icon, actions, panel, children }: Readonly<PageContainerProps>) {
  const { setBreadcrumbs } = useShell()
  const panelOpen = Boolean(panel?.opened)

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    return () => setBreadcrumbs([])
  }, [breadcrumbs, setBreadcrumbs])

  return (
    <div className={styles.frame}>
      <div className={`${styles.content} ${panelOpen ? styles.contentShifted : ''}`}>
        <header className={styles.actionBar}>
          {(title ?? description ?? icon) && (
            <div className={styles.titleGroup}>
              {icon && <span className={styles.titleIcon}>{icon}</span>}
              <div className={styles.titleText}>
                {title && <h1 className={styles.pageTitle}>{title}</h1>}
                {description && <p className={styles.pageDescription}>{description}</p>}
              </div>
            </div>
          )}
          <div className={styles.actions}>{actions}</div>
        </header>
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

import {
  Button,
  Group,
  Paper,
  Skeleton,
  Text,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBookmark,
  IconClock,
  IconCompass,
  IconSettings,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  getStudentProfile,
  listFavorites,
  listHistory,
} from '@/shared/api/endpoints'
import { useSession } from '@/shared/auth/use-session'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  DocumentGrid,
  EmptyState,
} from '@/pages/catalogue/components'
import type { PublicNote } from '@/pages/catalogue/types'
import { AccountPageLoader, AccountSidebar, SignInPrompt } from './components'
import { academicLabel, type StudentProfile } from './types'
import styles from './account.module.scss'

type LibraryTab = 'saved' | 'history'

export function LibraryPage() {
  const navigate = useNavigate()
  const session = useSession()
  const [tab, setTab] = useState<LibraryTab>('saved')

  useEffect(() => {
    if (session.ready && !session.authenticated) {
      void navigate({ to: '/login', search: { redirect: '/library' } as never })
    }
  }, [navigate, session.authenticated, session.ready])

  const profileQuery = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => getStudentProfile(),
    select: (payload) => payload?.data as StudentProfile,
    enabled: session.authenticated,
  })

  const favoritesQuery = useQuery({
    queryKey: ['student-favorites'],
    queryFn: () =>
      listFavorites().then((payload) =>
        normalizeCollectionResponse<PublicNote>(payload).data
      ),
    enabled: session.authenticated,
  })

  const historyQuery = useQuery({
    queryKey: ['student-history'],
    queryFn: () =>
      listHistory().then((payload) => normalizeCollectionResponse<PublicNote>(payload).data),
    enabled: session.authenticated,
  })

  const profile = profileQuery.data
  const favorites = favoritesQuery.data ?? []
  const history = historyQuery.data ?? []
  const currentDocuments = tab === 'saved' ? favorites : history
  const loading = tab === 'saved' ? favoritesQuery.isPending : historyQuery.isPending

  if (!session.ready) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="My library">
        <AccountPageLoader />
      </CataloguePage>
    )
  }

  if (!session.authenticated) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="My library">
        <SignInPrompt />
      </CataloguePage>
    )
  }

  return (
    <CataloguePage
      eyebrow="Your space"
      breadcrumbs={[BREADCRUMB_HOME, { label: 'My library' }]}
      title="My library"
      description="Your saved documents and the pages you opened recently, all in one calm place."
      actions={<BackLink to="/browse" label="Explore the catalogue" />}
    >
      <div className={styles.accountLayout}>
        <AccountSidebar profile={profile} active="library" />

        <div className={styles.accountMain}>
          <div className={styles.libraryStats}>
            <Stat icon={<IconBookmark size={18} />} value={favorites.length} label="Saved documents" />
            <Stat icon={<IconClock size={18} />} value={history.length} label="Recently viewed" />
            <div className={styles.programmeStat}>
              <Text className={styles.statLabel}>Your programme</Text>
              <Text fw={700} size="sm" mt={4} lineClamp={2}>
                {academicLabel(profile)}
              </Text>
              <Button
                component={Link}
                to="/profile"
                variant="subtle"
                color="brand"
                size="compact-sm"
                leftSection={<IconSettings size={14} />}
                mt="sm"
              >
                Edit programme
              </Button>
            </div>
          </div>

          <div className={styles.libraryTabs}>
            <button
              type="button"
              className={tab === 'saved' ? styles.tabActive : styles.tabItem}
              onClick={() => setTab('saved')}
            >
              Saved documents
              <span>{favorites.length}</span>
            </button>
            <button
              type="button"
              className={tab === 'history' ? styles.tabActive : styles.tabItem}
              onClick={() => setTab('history')}
            >
              Recently viewed
              <span>{history.length}</span>
            </button>
          </div>

          {loading ? (
            <div className={styles.libraryGridSkeleton}>
              <Skeleton height={300} radius="md" />
              <Skeleton height={300} radius="md" />
              <Skeleton height={300} radius="md" />
            </div>
          ) : currentDocuments.length > 0 ? (
            <DocumentGrid notes={currentDocuments} />
          ) : (
            <EmptyState
              icon={tab === 'saved' ? <IconBookmark size={26} /> : <IconCompass size={26} />}
              title={tab === 'saved' ? 'Nothing saved yet' : 'No reading history yet'}
              description={
                tab === 'saved'
                  ? 'Save a document from the catalogue and it will appear here for your next study session.'
                  : 'Open a document and we will keep it here so you can pick up where you left off.'
              }
              action={
                <Button
                  component={Link}
                  to="/browse"
                  color="brand"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Explore documents
                </Button>
              }
            />
          )}
        </div>
      </div>
    </CataloguePage>
  )
}

function Stat({
  icon,
  value,
  label,
}: Readonly<{ icon: React.ReactNode; value: number; label: string }>) {
  return (
    <Paper className={styles.statCard} withBorder radius="lg">
      <span className={styles.statIcon}>{icon}</span>
      <Text className={styles.statValue}>{value}</Text>
      <Text className={styles.statLabel}>{label}</Text>
    </Paper>
  )
}

export default LibraryPage

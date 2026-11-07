import {
  Button,
  Group,
  Paper,
  Skeleton,
  Text,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  getStudentProfile,
  listFavorites,
  listHistory,
  removeFavorite,
} from '@/shared/api/endpoints'
import { useSession } from '@/shared/auth/use-session'
import type { PublicNote, StudentProfile } from '@/shared/api/types'
import styles from './library-page.module.scss'

const PUBLIC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_PUBLIC_URL ?? 'http://localhost:3000'

type LibraryTab = 'saved' | 'history'

export function LibraryPage() {
  const navigate = useNavigate()
  const session = useSession()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<LibraryTab>('saved')

  useEffect(() => {
    if (session.ready && !session.authenticated) {
      void navigate({ to: '/login', search: { redirect: '/' } as never })
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
      listHistory().then((payload) =>
        normalizeCollectionResponse<PublicNote>(payload).data
      ),
    enabled: session.authenticated,
  })

  const removeMutation = useMutation({
    mutationFn: (noteId: string) => removeFavorite(noteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-favorites'] })
    },
  })

  const profile = profileQuery.data
  const favorites = favoritesQuery.data ?? []
  const history = historyQuery.data ?? []
  const documents = tab === 'saved' ? favorites : history
  const loading = tab === 'saved' ? favoritesQuery.isPending : historyQuery.isPending

  if (!session.ready) {
    return <Skeleton height={260} radius="lg" />
  }

  if (!session.authenticated) {
    return (
      <EmptyCard
        title="Sign in first"
        text="Your saved documents and reading history are waiting in your library."
        action={
          <Button component={Link} to="/login" color="brand">
            Sign in
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className={styles.header}>
        <div>
          <Text className={styles.kicker}>{session.user?.email}</Text>
          <Title order={1} className={styles.title}>
            {session.user?.fullName || 'My library'}
          </Title>
        </div>
      </div>

      {profile && (
        <Paper className={styles.programmeCard} radius="lg">
          <Text className={styles.label}>Your programme</Text>
          <Text fw={700} size="sm" mt={4}>
            {[profile.departmentName, profile.levelName, profile.semesterName]
              .filter(Boolean)
              .join(' · ') || 'Not set yet'}
          </Text>
          <Button
            component={Link}
            to="/profile"
            variant="subtle"
            color="brand"
            size="compact-sm"
            className={styles.programmeLink}
          >
            Edit programme
          </Button>
        </Paper>
      )}

      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === 'saved' ? styles.tabActive : styles.tab}
          onClick={() => setTab('saved')}
        >
          Saved
          <span>{favorites.length}</span>
        </button>
        <button
          type="button"
          className={tab === 'history' ? styles.tabActive : styles.tab}
          onClick={() => setTab('history')}
        >
          Reading history
          <span>{history.length}</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.cardsSkeleton}>
          <Skeleton height={112} radius="lg" />
          <Skeleton height={112} radius="lg" />
          <Skeleton height={112} radius="lg" />
        </div>
      ) : documents.length === 0 ? (
        <EmptyCard
          title={tab === 'saved' ? 'Nothing saved yet' : 'No reading history yet'}
          text={
            tab === 'saved'
              ? 'Save a document while reading and it will appear here.'
              : 'Open a note in Explore and it will appear here.'
          }
          action={
            <a href={PUBLIC_URL} className={styles.exploreLink}>
              Explore the catalogue
            </a>
          }
        />
      ) : (
        <div className={styles.cards}>
          {documents.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              variant={tab}
              onRemove={
                tab === 'saved' ? () => removeMutation.mutate(note.id) : undefined
              }
              removing={removeMutation.isPending}
            />
          ))}
        </div>
      )}
    </>
  )
}

function NoteCard({
  note,
  variant,
  onRemove,
  removing,
}: Readonly<{
  note: PublicNote
  variant: LibraryTab
  onRemove?: () => void
  removing?: boolean
}>) {
  return (
    <Link to="/notes/$noteId" params={{ noteId: note.id }} className={styles.card}>
      <div className={styles.cover}>
        {note.coverUrl ? (
          <img src={note.coverUrl} alt="" loading="lazy" />
        ) : (
          <span>{note.courseCode}</span>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}>
          <span>{note.courseCode}</span>
          <span className={styles.price}>{note.price ? undefined : 'Free'}</span>
        </div>
        <Text className={styles.cardTitle} lineClamp={2}>
          {note.title}
        </Text>
        <div className={styles.cardMeta}>
          <span>{note.pageCount} pages</span>
          <span>
            {variant === 'saved' ? 'Saved' : 'Read'}
            {' · '}
            {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
              dateStyle: 'medium',
            })}
          </span>
        </div>
        {onRemove && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onRemove()
            }}
            disabled={removing}
          >
            Remove
          </button>
        )}
      </div>
    </Link>
  )
}

function EmptyCard({
  title,
  text,
  action,
}: Readonly<{
  title: string
  text: string
  action?: React.ReactNode
}>) {
  return (
    <Paper className={styles.empty} radius="lg">
      <Text size="lg" fw={700}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" mt={6} lh={1.6}>
        {text}
      </Text>
      <Group mt="lg">{action}</Group>
    </Paper>
  )
}

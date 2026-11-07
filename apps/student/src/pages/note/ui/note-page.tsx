import { Alert, Badge, Button, Group, Paper, Skeleton, Text, Title } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  addFavorite,
  getNote,
  listFavoriteIds,
  recordNoteView,
  removeFavorite,
} from '@/shared/api/endpoints'
import {
  formatDate,
  formatPrice,
  NOTE_TYPE_LABELS,
  type NoteDetail,
} from '@/shared/api/types'
import styles from './note-page.module.scss'

const PUBLIC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_PUBLIC_URL ?? 'http://localhost:3000'

export function NotePage() {
  const { noteId } = useParams({ from: '/_app/notes/$noteId' })
  const queryClient = useQueryClient()

  const noteQuery = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
  })
  const note = noteQuery.data as NoteDetail | undefined

  const favoriteIdsQuery = useQuery({
    queryKey: ['favorite-ids'],
    queryFn: () => listFavoriteIds(),
    select: (payload) => (payload?.data?.ids ?? []) as string[],
  })
  const isFavorite = (favoriteIdsQuery.data ?? []).includes(noteId)

  const toggleFavorite = useMutation({
    mutationFn: () => (isFavorite ? removeFavorite(noteId) : addFavorite(noteId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorite-ids'] })
      void queryClient.invalidateQueries({ queryKey: ['student-favorites'] })
    },
  })

  useEffect(() => {
    if (!note?.id) return
    void recordNoteView(note.id).then(() =>
      queryClient.invalidateQueries({ queryKey: ['student-history'] })
    )
  }, [note?.id, queryClient])

  if (noteQuery.isPending) {
    return (
      <div className={styles.stack}>
        <Skeleton height={220} radius="lg" />
        <Skeleton height={28} width="80%" radius="sm" />
        <Skeleton height={16} width="55%" radius="sm" />
        <Skeleton height={120} radius="lg" />
      </div>
    )
  }

  if (noteQuery.isError || !note) {
    return (
      <Alert color="red" title="Document unavailable">
        This document may have been unpublished or removed.
      </Alert>
    )
  }

  const cover = note.pages[0]?.url ?? null

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to my library
      </Link>

      <div className={styles.hero}>
        {cover ? (
          <img src={cover} alt="" className={styles.cover} loading="lazy" />
        ) : (
          <div className={styles.coverFallback}>{note.courseCode}</div>
        )}
        <Badge className={styles.typeBadge} variant="filled" color="brand">
          {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
        </Badge>
      </div>

      <div className={styles.heading}>
        <Text className={styles.courseCode}>
          {note.courseCode} · {note.courseName}
        </Text>
        <Title order={1} className={styles.title}>
          {note.title}
        </Title>
        <Text className={styles.meta}>
          {note.pages.length} pages · {formatPrice(note.price)} · {formatDate(note.updatedAt)}
        </Text>
      </div>

      <Group grow gap="sm" className={styles.actions}>
        <Button
          color="brand"
          radius="md"
          loading={toggleFavorite.isPending}
          onClick={() => toggleFavorite.mutate()}
        >
          {isFavorite ? 'Saved to library' : 'Save to library'}
        </Button>
        <Button
          component="a"
          href={`${PUBLIC_URL}/notes/${note.id}`}
          target="_blank"
          rel="noreferrer"
          variant="outline"
          color="gray"
          radius="md"
        >
          Open on web
        </Button>
      </Group>

      {note.description && (
        <Paper className={styles.description} radius="lg">
          <Text size="xs" className={styles.sectionLabel}>
            About this document
          </Text>
          <Text size="sm" mt={6} lh={1.65}>
            {note.description}
          </Text>
        </Paper>
      )}

      <div className={styles.details}>
        <DetailRow label="Programme" value={note.courseDepartmentName ?? '—'} />
        <DetailRow label="Level" value={note.courseLevelName ?? '—'} />
        <DetailRow label="Semester" value={note.courseSemesterName ?? '—'} />
        <DetailRow label="Contributor" value={note.contributorName ?? 'DigitalNotes team'} />
        <DetailRow label="Published" value={formatDate(note.publishedAt)} />
      </div>

      {note.pages.length > 0 && (
        <section className={styles.reader}>
          <Text size="xs" className={styles.sectionLabel}>
            Document · {note.pages.length} pages
          </Text>
          <div className={styles.pages}>
            {note.pages.map((page, index) => (
              <figure key={page.id} className={styles.pageFigure}>
                {page.url ? (
                  <img
                    src={page.url}
                    alt={`${note.title} — page ${index + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.pageMissing}>Page {index + 1}</div>
                )}
                <figcaption>Page {index + 1}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className={styles.detailRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

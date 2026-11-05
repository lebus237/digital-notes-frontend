import {
  Alert,
  Badge,
  Box,
  Group,
  Paper,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArchive,
  IconCheck,
  IconChevronRight,
  IconClockHour4,
  IconFileDescription,
  IconRefresh,
  IconSearch,
  IconX,
} from '@tabler/icons-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AppTable, PageContainer, type TableColumn } from '@digitalnotes/core'
import { listAdminNotes } from '@/shared/api/endpoints/notes'
import { queryClient } from '@/shared/api/query-client'
import {
  formatDate,
  formatPrice,
  NOTE_STATUS_META,
  NOTE_TYPE_LABELS,
  REVIEW_FILTERS,
  type AdminNoteListItem,
  type AdminNoteStatus,
} from '../model/note'
import { NoteReviewDrawer } from './note-review-drawer'
import styles from './notes-review.module.scss'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Notes review' }]

const stats: Array<{
  status: AdminNoteStatus
  label: string
  icon: typeof IconClockHour4
  tone: 'amber' | 'green' | 'red' | 'gray'
}> = [
  { status: 'PENDING_REVIEW', label: 'Pending review', icon: IconClockHour4, tone: 'amber' },
  { status: 'PUBLISHED', label: 'Published', icon: IconCheck, tone: 'green' },
  { status: 'REJECTED', label: 'Rejected', icon: IconX, tone: 'red' },
  { status: 'ARCHIVED', label: 'Archived', icon: IconArchive, tone: 'gray' },
]

const PAGE_SIZE_OPTIONS = ['10', '20', '50']

export function NotesReviewView() {
  const [status, setStatus] = useState<AdminNoteStatus | 'ALL'>('PENDING_REVIEW')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  const countQueries = useQueries({
    queries: stats.map((stat) => ({
      queryKey: ['admin-notes', 'count', stat.status],
      queryFn: () => listAdminNotes({ status: stat.status, limit: 1 }),
      select: (payload: any) => Number(payload?.meta?.total ?? 0),
    })),
  })

  const notesQuery = useQuery({
    queryKey: ['admin-notes', status, debouncedSearch, page, limit],
    queryFn: () =>
      listAdminNotes({
        ...(status === 'ALL' ? {} : { status }),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        page,
        limit,
      }),
    placeholderData: (previous) => previous,
  })

  const notes: AdminNoteListItem[] = notesQuery.data?.data ?? []
  const meta = notesQuery.data?.meta ?? {}
  const lastPage = Math.max(1, Number(meta.lastPage) || 1)
  const total = Number(meta.total) || 0

  const refresh = () => {
    setFeedback(null)
    void queryClient.invalidateQueries({ queryKey: ['admin-notes'] })
    void notesQuery.refetch()
  }

  const columns: TableColumn[] = [
    {
      accessor: 'title',
      title: 'Note',
      render: (note: AdminNoteListItem) => (
        <Stack gap={2}>
          <Text fw={600} size="sm" lineClamp={1}>
            {note.title}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {note.courseCode || '—'} · {note.courseName || 'Unknown course'}
          </Text>
        </Stack>
      ),
    },
    {
      accessor: 'noteType',
      title: 'Type',
      render: (note: AdminNoteListItem) => (
        <Text size="sm" c="dimmed">
          {NOTE_TYPE_LABELS[note.noteType]}
        </Text>
      ),
    },
    {
      accessor: 'price',
      title: 'Price',
      render: (note: AdminNoteListItem) => (
        <Text size="sm">{formatPrice(note.price)}</Text>
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (note: AdminNoteListItem) => {
        const statusMeta = NOTE_STATUS_META[note.status]
        return (
          <Badge
            variant="light"
            color={statusMeta.color}
            leftSection={
              <span
                className={styles.statusDot}
                style={{ backgroundColor: statusMeta.dot }}
              />
            }
          >
            {statusMeta.label}
          </Badge>
        )
      },
    },
    {
      accessor: 'pageCount',
      title: 'Pages',
      textAlign: 'center',
      render: (note: AdminNoteListItem) => (
        <Text size="sm" c="dimmed" ta="center">
          {note.pageCount}
        </Text>
      ),
    },
    {
      accessor: 'updatedAt',
      title: 'Updated',
      render: (note: AdminNoteListItem) => (
        <Text size="sm" c="dimmed">
          {formatDate(note.updatedAt)}
        </Text>
      ),
    },
    {
      accessor: 'open',
      title: '',
      width: 36,
      textAlign: 'right',
      render: () => <IconChevronRight size={16} color="var(--mantine-color-dimmed)" />,
    },
  ]

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Notes review"
      description="Triage submissions, inspect pages and publish trusted course material."
      actions={[
        {
          key: 'refresh',
          label: 'Refresh',
          icon: <IconRefresh size={18} />,
          onClick: refresh,
        },
      ]}
    >
      <Stack gap="lg">
        {feedback && (
          <Alert color="green" withCloseButton onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const active = status === stat.status
            const count = countQueries[index]

            return (
              <Paper
                key={stat.status}
                className={`${styles.statCard} ${active ? styles.statCardActive : ''}`}
                onClick={() => {
                  setStatus(stat.status)
                  setPage(1)
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setStatus(stat.status)
                    setPage(1)
                  }
                }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={4}>
                    <Text className={styles.statLabel}>{stat.label}</Text>
                    {count.isLoading ? (
                      <Skeleton height={30} width={48} />
                    ) : (
                      <Title order={2} className={styles.statValue}>
                        {count.data ?? 0}
                      </Title>
                    )}
                  </Stack>
                  <ThemeIcon
                    className={`${styles.statIcon} ${styles[`tone${stat.tone}`]}`}
                    variant="light"
                    size={40}
                    radius="md"
                  >
                    <Icon size={21} stroke={1.7} />
                  </ThemeIcon>
                </Group>
              </Paper>
            )
          })}
        </SimpleGrid>

        <Paper className={styles.tableCard} withBorder radius="lg">
          <Group justify="space-between" align="center" p="md" gap="md" wrap="wrap">
            <Box className={styles.segmentedWrap}>
              <SegmentedControl
                value={status}
                onChange={(value) => {
                  setStatus(value as AdminNoteStatus | 'ALL')
                  setPage(1)
                }}
                data={REVIEW_FILTERS}
                size="sm"
                className={styles.segmented}
              />
            </Box>

            <Group gap="sm" wrap="nowrap" className={styles.toolbarRight}>
              <Text size="xs" c="dimmed" visibleFrom="sm">
                {notesQuery.isFetching ? 'Refreshing…' : `${total} note${total === 1 ? '' : 's'}`}
              </Text>
              <TextInput
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search a title…"
                leftSection={<IconSearch size={16} />}
                size="sm"
                className={styles.search}
              />
            </Group>
          </Group>

          <Box className={styles.tableWrap}>
            <AppTable
              records={notes}
              columns={columns}
              loading={notesQuery.isLoading}
              skeletonRows={6}
              minHeight={240}
              onRowClick={(note: AdminNoteListItem) => setSelectedNoteId(note.id)}
              emptyState={
                <Stack align="center" gap="xs" py="xl">
                  <ThemeIcon variant="light" color="brand" size={52} radius="xl">
                    <IconFileDescription size={26} stroke={1.6} />
                  </ThemeIcon>
                  <Text fw={600}>No notes here</Text>
                  <Text size="sm" c="dimmed" ta="center" maw={320}>
                    {status === 'PENDING_REVIEW'
                      ? 'The review queue is clear. New submissions will appear here.'
                      : 'No note matches this filter yet.'}
                  </Text>
                </Stack>
              }
            />
          </Box>

          <Group justify="space-between" align="center" p="md" className={styles.footer}>
            <Text size="sm" c="dimmed">
              Page {page} of {lastPage}
            </Text>
            <Group gap="sm">
              <Select
                aria-label="Notes per page"
                value={String(limit)}
                onChange={(value) => {
                  setLimit(Number(value) || 20)
                  setPage(1)
                }}
                data={PAGE_SIZE_OPTIONS.map((value) => ({ value, label: value }))}
                size="xs"
                w={72}
                allowDeselect={false}
              />
              <Pagination
                value={page}
                onChange={setPage}
                total={lastPage}
                size="sm"
                siblings={1}
                boundaries={1}
              />
            </Group>
          </Group>
        </Paper>
      </Stack>

      <NoteReviewDrawer
        noteId={selectedNoteId}
        onClose={() => setSelectedNoteId(null)}
        onActionDone={(message) => {
          setFeedback(message)
          setSelectedNoteId(null)
        }}
      />
    </PageContainer>
  )
}

export default NotesReviewView

import {
  Alert,
  Badge,
  Button,
  Group,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import { IconFileDescription, IconPlus, IconSearch } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  AppTable,
  getServerMessage,
  PageContainer,
  type TableColumn,
} from '@digitalnotes/core'
import { listMyNotes, submitNote } from '@/shared/api/endpoints'
import { queryClient } from '@/shared/api/query-client'
import {
  noteStatusLabels,
  noteTypeLabels,
  type NoteStatus,
} from '@/entities/note'
import { CreateNoteForm } from './create-note-form'
import {
  formatDate,
  formatPrice,
  NOTE_STATUS_COLORS,
  type ContributorNote,
} from '../model/note'

const STATUS_OPTIONS: Array<{ value: NoteStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending review' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const PAGE_SIZE_OPTIONS = ['10', '20', '50']

export function NotesView() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const creating = pathname === '/submit'

  const [panelOpen, setPanelOpen] = useState(creating)
  const [status, setStatus] = useState<NoteStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setPanelOpen(creating)
  }, [creating])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  const notesQuery = useQuery({
    queryKey: ['contributor-notes', status, debouncedSearch, page, limit],
    queryFn: () =>
      listMyNotes({
        ...(status === 'ALL' ? {} : { status }),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        page,
        limit,
      }),
    placeholderData: (previous) => previous,
  })

  const notes: ContributorNote[] = notesQuery.data?.data ?? []
  const meta = notesQuery.data?.meta ?? {}
  const total = Number(meta.total) || 0
  const lastPage = Math.max(1, Number(meta.lastPage) || 1)

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await submitNote(id, {})
      if (result && typeof result === 'object' && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not submit this note.')
      }
      return id
    },
    onSuccess: () => {
      setFeedback('Note submitted for review.')
      void queryClient.invalidateQueries({ queryKey: ['contributor-notes'] })
    },
    onError: (error) => {
      setFeedback(getServerMessage(error, 'Could not submit this note.'))
    },
  })

  const closePanel = () => {
    setPanelOpen(false)
    if (creating) {
      void navigate({ to: '/' })
    }
  }

  const columns: TableColumn[] = useMemo(
    () => [
      {
        accessor: 'title',
        title: 'Note',
        width: 260,
        render: (note: ContributorNote) => (
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
        width: 110,
        render: (note: ContributorNote) => (
          <Text size="sm" c="dimmed">
            {noteTypeLabels[note.noteType]}
          </Text>
        ),
      },
      {
        accessor: 'price',
        title: 'Price',
        width: 95,
        render: (note: ContributorNote) => (
          <Text size="sm">{formatPrice(note.price)}</Text>
        ),
      },
      {
        accessor: 'status',
        title: 'Status',
        width: 145,
        render: (note: ContributorNote) => (
          <Badge variant="light" color={NOTE_STATUS_COLORS[note.status]}>
            {noteStatusLabels[note.status]}
          </Badge>
        ),
      },
      {
        accessor: 'pageCount',
        title: 'Pages',
        width: 60,
        textAlign: 'center',
        render: (note: ContributorNote) => (
          <Text size="sm" c="dimmed" ta="center">
            {note.pageCount}
          </Text>
        ),
      },
      {
        accessor: 'updatedAt',
        title: 'Updated',
        width: 105,
        render: (note: ContributorNote) => (
          <Text size="sm" c="dimmed">
            {formatDate(note.updatedAt)}
          </Text>
        ),
      },
      {
        accessor: 'actions',
        title: '',
        width: 100,
        textAlign: 'right',
        render: (note: ContributorNote) =>
          note.status === 'DRAFT' || note.status === 'REJECTED' ? (
            <Button
              size="xs"
              variant="light"
              color="brand"
              loading={submitMutation.isPending && submitMutation.variables === note.id}
              onClick={(event) => {
                event.stopPropagation()
                submitMutation.mutate(note.id)
              }}
            >
              {note.status === 'REJECTED' ? 'Resubmit' : 'Submit'}
            </Button>
          ) : (
            <Text size="xs" c="dimmed" ta="right">
              {note.status === 'PENDING_REVIEW' ? 'In review' : '—'}
            </Text>
          ),
      },
    ],
    [submitMutation.isPending, submitMutation.variables]
  )

  return (
    <PageContainer
      breadcrumbs={[
        { label: 'Home', to: '/' as const },
        { label: creating ? 'Submit' : 'My notes' },
      ]}
      title={creating ? 'Submit a note' : 'My notes'}
      description={
        creating
          ? 'Upload pages, choose the course and send your work for review.'
          : 'Track your submissions and their review status.'
      }
      actions={
        creating
          ? []
          : [
              {
                key: 'new-note',
                label: 'New note',
                icon: <IconPlus size={18} />,
                onClick: () => setPanelOpen(true),
              },
            ]
      }
      panel={{
        opened: panelOpen,
        title: 'New note',
        onClose: closePanel,
        children: (
          <CreateNoteForm
            onCreated={() => {
              setPanelOpen(false)
              setFeedback('Note submitted for review.')
              void queryClient.invalidateQueries({ queryKey: ['contributor-notes'] })
              if (creating) {
                void navigate({ to: '/' })
              }
            }}
          />
        ),
      }}
    >
      <Stack gap="lg">
        {feedback && (
          <Alert color="green" withCloseButton onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(value) => {
              setStatus((value ?? 'ALL') as NoteStatus | 'ALL')
              setPage(1)
            }}
            data={STATUS_OPTIONS}
            w={190}
            allowDeselect={false}
          />
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search my notes…"
            leftSection={<IconSearch size={16} />}
            w={280}
          />
        </Group>

        <AppTable
          records={notes}
          columns={columns}
          loading={notesQuery.isLoading}
          skeletonRows={5}
          minHeight={260}
          emptyState={
            <Stack align="center" gap="xs" py="xl">
              <ThemeIcon variant="light" color="brand" size={52} radius="xl">
                <IconFileDescription size={26} stroke={1.6} />
              </ThemeIcon>
              <Text fw={600}>No notes yet</Text>
              <Text size="sm" c="dimmed" ta="center" maw={320}>
                {status === 'ALL'
                  ? 'Submit your first note to start building your contributor profile.'
                  : 'No note matches this filter.'}
              </Text>
              <Button variant="light" color="brand" mt="xs" onClick={() => setPanelOpen(true)}>
                Create a note
              </Button>
            </Stack>
          }
        />

        <Group justify="space-between" align="center" wrap="wrap">
          <Text size="sm" c="dimmed">
            {total} note{total === 1 ? '' : 's'}
          </Text>
          <Group gap="sm">
            <Select
              aria-label="Notes per page"
              value={String(limit)}
              onChange={(value) => {
                setLimit(Number(value) || 10)
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
      </Stack>
    </PageContainer>
  )
}

export default NotesView

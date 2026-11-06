import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconArchive,
  IconCheck,
  IconCoin,
  IconFileDescription,
  IconPhoto,
  IconSend,
  IconX,
} from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  archiveNote,
  getAdminNote,
  publishNote,
  rejectNote,
} from '@/shared/api/endpoints/notes'
import { queryClient } from '@/shared/api/query-client'
import {
  formatDate,
  formatPrice,
  NOTE_STATUS_META,
  NOTE_TYPE_LABELS,
  type AdminNoteDetail,
} from '../model/note'
import styles from './notes-review.module.scss'

type ReviewAction = 'publish' | 'reject' | 'archive'

const ACTION_MESSAGES: Record<ReviewAction, string> = {
  publish: 'Note published. It is now visible to students.',
  reject: 'Note rejected. The contributor can edit and resubmit it.',
  archive: 'Note archived.',
}

const ACTIONS = {
  publish: publishNote,
  reject: rejectNote,
  archive: archiveNote,
}

function assertActionSucceeded(result: any) {
  if (result && typeof result === 'object' && result.status === 'error') {
    throw new Error(result.error?.message ?? 'The action could not be completed.')
  }
}

export function NoteReviewDrawer({
  noteId,
  onClose,
  onActionDone,
}: Readonly<{
  noteId: string | null
  onClose: () => void
  onActionDone: (message: string) => void
}>) {
  const [actionError, setActionError] = useState<string | null>(null)

  const noteQuery = useQuery({
    queryKey: ['admin-note', noteId],
    queryFn: () => getAdminNote(noteId as string),
    enabled: Boolean(noteId),
  })

  const actionMutation = useMutation({
    mutationFn: async (action: ReviewAction) => {
      const result = await ACTIONS[action](noteId as string, {})
      assertActionSucceeded(result)
      return action
    },
    onSuccess: (action) => {
      setActionError(null)
      void queryClient.invalidateQueries({ queryKey: ['admin-notes'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-note', noteId] })
      onActionDone(ACTION_MESSAGES[action])
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : 'The action could not be completed.')
    },
  })

  const note = noteQuery.data as AdminNoteDetail | undefined
  const isPending = actionMutation.isPending
  const canReview = note?.status === 'PENDING_REVIEW'
  const canArchive = note ? note.status !== 'ARCHIVED' : false
  const statusMeta = note ? NOTE_STATUS_META[note.status] : null

  return (
    <Drawer
      opened={Boolean(noteId)}
      onClose={onClose}
      position="right"
      size="lg"
      padding="lg"
      title={
        <Group gap="xs">
          <ThemeIcon variant="light" color="brand" radius="md" size={34}>
            <IconFileDescription size={19} stroke={1.7} />
          </ThemeIcon>
          <Text fw={700}>Review note</Text>
        </Group>
      }
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
    >
      <Stack gap="lg" className={styles.drawerBody}>
        {noteQuery.isLoading && (
          <Stack gap="md">
            <Skeleton height={28} width="70%" />
            <Skeleton height={14} width="45%" />
            <Skeleton height={120} radius="md" />
            <Skeleton height={180} radius="md" />
          </Stack>
        )}

        {noteQuery.isError && (
          <Alert color="red" title="Could not load this note">
            {noteQuery.error instanceof Error ? noteQuery.error.message : 'Unknown error.'}
          </Alert>
        )}

        {note && statusMeta && (
          <>
            <Box>
              <Group gap="xs" mb="xs">
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
                <Badge variant="outline" color="gray">
                  {NOTE_TYPE_LABELS[note.noteType]}
                </Badge>
              </Group>
              <Title order={3} className={styles.drawerTitle}>
                {note.title}
              </Title>
              <Text size="sm" c="dimmed" mt={4}>
                {note.courseCode || '—'} · {note.courseName || 'Unknown course'}
              </Text>
            </Box>

            <Text size="sm" c="dimmed">
              {note.description || 'No description provided.'}
            </Text>

            <SimpleGrid cols={3} spacing="sm">
              <Paper className={styles.metaTile} withBorder>
                <ThemeIcon variant="light" color="brand" size={28} radius="sm">
                  <IconCoin size={15} />
                </ThemeIcon>
                <Text size="xs" c="dimmed" mt={6}>
                  Price
                </Text>
                <Text size="sm" fw={600}>
                  {formatPrice(note.price)}
                </Text>
              </Paper>
              <Paper className={styles.metaTile} withBorder>
                <ThemeIcon variant="light" color="blue" size={28} radius="sm">
                  <IconPhoto size={15} />
                </ThemeIcon>
                <Text size="xs" c="dimmed" mt={6}>
                  Pages
                </Text>
                <Text size="sm" fw={600}>
                  {note.pages.length}
                </Text>
              </Paper>
              <Paper className={styles.metaTile} withBorder>
                <ThemeIcon variant="light" color="gray" size={28} radius="sm">
                  <IconSend size={15} />
                </ThemeIcon>
                <Text size="xs" c="dimmed" mt={6}>
                  Submitted
                </Text>
                <Text size="sm" fw={600}>
                  {formatDate(note.providedAt ?? note.createdAt)}
                </Text>
              </Paper>
            </SimpleGrid>

            <Divider />

            <Box>
              <Group justify="space-between" mb="sm">
                <Text fw={600} size="sm">
                  Pages
                </Text>
                <Text size="xs" c="dimmed">
                  Updated {formatDate(note.updatedAt)}
                </Text>
              </Group>

              {note.pages.length === 0 ? (
                <Paper className={styles.emptyPages} withBorder>
                  <IconFileDescription size={24} stroke={1.5} />
                  <Text size="sm" c="dimmed">
                    No pages uploaded for this note.
                  </Text>
                </Paper>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  {note.pages.map((page) => (
                    <Paper key={page.id} className={styles.pagePreview} withBorder>
                      {page.url && page.mimeType?.startsWith('image/') ? (
                        <Image
                          src={page.url}
                          alt={`Page ${page.sortOrder + 1}`}
                          h={170}
                          fit="contain"
                          radius="sm"
                        />
                      ) : (
                        <Stack align="center" justify="center" h={170} gap={6}>
                          <IconFileDescription size={30} stroke={1.4} />
                          <Text size="xs" c="dimmed">
                            {page.url ? 'Preview unavailable' : 'No file'}
                          </Text>
                        </Stack>
                      )}
                      <Text size="xs" c="dimmed" mt={8} ta="center">
                        Page {page.sortOrder + 1}
                        {page.mimeType ? ` · ${page.mimeType.split('/').pop()?.toUpperCase()}` : ''}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>
              )}
            </Box>

            {actionError && (
              <Alert color="red" title="Action failed">
                {actionError}
              </Alert>
            )}

            <Box className={styles.drawerFooter}>
              <Group justify="space-between" align="center">
                <Tooltip
                  label={canArchive ? 'Archive this note' : 'Already archived'}
                  withArrow
                >
                  <span>
                    <Button
                      variant="subtle"
                      color="gray"
                      leftSection={<IconArchive size={16} />}
                      disabled={!canArchive || isPending}
                      onClick={() => actionMutation.mutate('archive')}
                      loading={actionMutation.isPending && actionMutation.variables === 'archive'}
                    >
                      Archive
                    </Button>
                  </span>
                </Tooltip>

                <Group gap="sm">
                  <Tooltip
                    label={canReview ? 'Reject this submission' : 'Only pending notes can be reviewed'}
                    withArrow
                  >
                    <span>
                      <Button
                        variant="light"
                        color="red"
                        leftSection={<IconX size={16} />}
                        disabled={!canReview || isPending}
                        onClick={() => actionMutation.mutate('reject')}
                        loading={actionMutation.isPending && actionMutation.variables === 'reject'}
                      >
                        Reject
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip
                    label={canReview ? 'Publish this note' : 'Only pending notes can be published'}
                    withArrow
                  >
                    <span>
                      <Button
                        color="brand"
                        leftSection={<IconCheck size={16} />}
                        disabled={!canReview || isPending}
                        onClick={() => actionMutation.mutate('publish')}
                        loading={actionMutation.isPending && actionMutation.variables === 'publish'}
                      >
                        Publish
                      </Button>
                    </span>
                  </Tooltip>
                </Group>
              </Group>
            </Box>
          </>
        )}
      </Stack>
    </Drawer>
  )
}

export default NoteReviewDrawer

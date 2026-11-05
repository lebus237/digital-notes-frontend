import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconBook2, IconClock, IconDownload, IconFileDescription, IconPhoto } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { getNote } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  EmptyState,
} from './components'
import {
  formatDate,
  formatPrice,
  NOTE_TYPE_LABELS,
  type NoteDetail,
} from './types'
import styles from './catalogue.module.scss'

export function NotePage() {
  const { noteId } = useParams({ from: '/notes/$noteId' })

  const noteQuery = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
  })

  const note = noteQuery.data as NoteDetail | undefined

  if (noteQuery.isError || (noteQuery.isSuccess && !note)) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Note unavailable">
        <Alert color="red">
          This note is not available. It may have been unpublished or removed.
        </Alert>
        <BackLink to="/" label="Back to catalogue" />
      </CataloguePage>
    )
  }

  return (
    <CataloguePage
      breadcrumbs={[
        BREADCRUMB_HOME,
        ...(note
          ? [
              {
                label: note.courseCode,
                to: '/courses/$courseId',
                params: { courseId: note.courseId },
              },
            ]
          : []),
        { label: note?.title ?? 'Note' },
      ]}
      title={note?.title ?? 'Loading note…'}
      description={note ? `${note.courseCode} · ${note.courseName}` : undefined}
      actions={
        note ? (
          <BackLink
            to="/courses/$courseId"
            params={{ courseId: note.courseId }}
            label={note.courseCode}
          />
        ) : undefined
      }
    >
      {noteQuery.isPending && (
        <Paper className={styles.noteLoading} withBorder radius="lg" p="xl">
          <Text c="dimmed">Loading note…</Text>
        </Paper>
      )}

      {note && (
        <Box className={styles.noteLayout}>
          <Stack gap="lg">
            <Paper className={styles.noteIntro} withBorder radius="lg" p="lg">
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                <Box>
                  <Group gap="xs" mb="sm">
                    <Badge color="brand" variant="light">
                      {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
                    </Badge>
                    <Badge color="gray" variant="outline">
                      {note.pages.length} page{note.pages.length === 1 ? '' : 's'}
                    </Badge>
                  </Group>
                  <Title order={2} className={styles.noteTitle}>
                    {note.title}
                  </Title>
                  <Text size="sm" c="dimmed" mt={6}>
                    {note.courseCode} · {note.courseName}
                  </Text>
                </Box>
                <Button
                  color="brand"
                  leftSection={<IconBook2 size={17} />}
                  onClick={() =>
                    document.getElementById('note-pages')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Read pages
                </Button>
              </Group>

              {note.description && (
                <>
                  <Divider my="lg" />
                  <Text size="sm" c="dimmed">
                    {note.description}
                  </Text>
                </>
              )}
            </Paper>

            <Box id="note-pages">
              <Group justify="space-between" mb="md">
                <Title order={3} className={styles.sectionTitle}>
                  Pages
                </Title>
                <Text size="xs" c="dimmed">
                  Updated {formatDate(note.updatedAt)}
                </Text>
              </Group>

              {note.pages.length === 0 ? (
                <EmptyState
                  icon={<IconFileDescription size={26} />}
                  title="No pages available"
                  description="This note does not have any viewable pages yet."
                />
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {note.pages.map((page) => (
                    <Paper key={page.id} className={styles.pageCard} withBorder radius="lg" p="sm">
                      {page.url && page.mimeType?.startsWith('image/') ? (
                        <Image
                          src={page.url}
                          alt={`Page ${page.sortOrder + 1} of ${note.title}`}
                          h={280}
                          fit="contain"
                          radius="md"
                        />
                      ) : (
                        <Stack align="center" justify="center" h={280} gap={8}>
                          <ThemeIcon variant="light" color="brand" size={48} radius="xl">
                            <IconFileDescription size={24} />
                          </ThemeIcon>
                          <Text size="sm" c="dimmed">
                            Preview unavailable
                          </Text>
                          {page.url && (
                            <Button
                              component="a"
                              href={page.url}
                              target="_blank"
                              rel="noreferrer"
                              variant="light"
                              size="xs"
                              leftSection={<IconDownload size={14} />}
                            >
                              Open file
                            </Button>
                          )}
                        </Stack>
                      )}
                      <Group justify="space-between" mt="sm">
                        <Text size="xs" c="dimmed">
                          Page {page.sortOrder + 1}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {page.mimeType?.split('/').pop()?.toUpperCase() ?? 'FILE'}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Stack>

          <Stack gap="md" className={styles.noteSidebar}>
            <Paper className={styles.sidebarCard} withBorder radius="lg" p="lg">
              <Text className={styles.eyebrow}>Access</Text>
              <Group justify="space-between" align="center" mt="xs">
                <Text size="xl" fw={700} className={styles.price}>
                  {formatPrice(note.price)}
                </Text>
                <Badge color="green" variant="light">
                  Pilot access
                </Badge>
              </Group>
              <Text size="xs" c="dimmed" mt="sm">
                Access is free during the pilot. The paid flow will be enabled once the
                marketplace launches.
              </Text>
              <Button
                fullWidth
                mt="md"
                color="brand"
                leftSection={<IconBook2 size={16} />}
                onClick={() =>
                  document.getElementById('note-pages')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Open note
              </Button>
            </Paper>

            <Paper className={styles.sidebarCard} withBorder radius="lg" p="lg">
              <Text className={styles.eyebrow}>Details</Text>
              <Stack gap="sm" mt="sm">
                <Group justify="space-between">
                  <Group gap={6}>
                    <IconPhoto size={15} />
                    <Text size="sm" c="dimmed">
                      Pages
                    </Text>
                  </Group>
                  <Text size="sm" fw={600}>
                    {note.pages.length}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group gap={6}>
                    <IconClock size={15} />
                    <Text size="sm" c="dimmed">
                      Added
                    </Text>
                  </Group>
                  <Text size="sm" fw={600}>
                    {formatDate(note.providedAt)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group gap={6}>
                    <IconBook2 size={15} />
                    <Text size="sm" c="dimmed">
                      Course
                    </Text>
                  </Group>
                  <Text size="sm" fw={600}>
                    {note.courseCode}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      )}
    </CataloguePage>
  )
}

export default NotePage

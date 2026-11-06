import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook2,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCopy,
  IconDownload,
  IconFileDescription,
  IconPhoto,
  IconUser,
  IconZoomIn,
  IconBookmark,
} from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getNote, listCourseNotes } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  DocumentGrid,
  EmptyState,
  SectionHeading,
} from './components'
import {
  formatDate,
  formatPrice,
  getInitials,
  NOTE_TYPE_LABELS,
  type CourseNote,
  type NoteDetail,
} from './types'
import styles from './catalogue.module.scss'

const STUDENT_APP_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_STUDENT_URL ?? 'http://localhost:3003'

export function NotePage() {
  const { noteId } = useParams({ from: '/notes/$noteId' })
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const noteQuery = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
  })

  const note = noteQuery.data as NoteDetail | undefined

  const relatedQuery = useQuery({
    queryKey: ['related-notes', note?.courseId],
    queryFn: () =>
      listCourseNotes(note?.courseId as string, { limit: 100 }).then((payload) =>
        normalizeCollectionResponse<CourseNote>(payload).data
      ),
    enabled: Boolean(note?.courseId),
  })

  const relatedNotes = (relatedQuery.data ?? [])
    .filter((item) => item.id !== note?.id)
    .map((item) => ({
      ...item,
      courseCode: note?.courseCode,
      courseName: note?.courseName,
    }))

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const scrollToPages = () => {
    document.getElementById('note-pages')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (noteQuery.isError || (noteQuery.isSuccess && !note)) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Note unavailable">
        <Alert color="red">
          This note is not available. It may have been unpublished or removed.
        </Alert>
        <BackLink to="/browse" label="Back to the library" />
      </CataloguePage>
    )
  }

  const cover = note?.pages[0]?.url ?? null
  const viewerPage = viewerIndex !== null ? note?.pages[viewerIndex] : undefined

  return (
    <CataloguePage
      eyebrow={note ? (NOTE_TYPE_LABELS[note.noteType] ?? note.noteType) : 'Document'}
      breadcrumbs={[
        BREADCRUMB_HOME,
        { label: 'Explore', to: '/browse' },
        ...(note
          ? [
              {
                label: note.courseCode,
                to: '/courses/$courseId',
                params: { courseId: note.courseId },
              },
            ]
          : []),
        { label: note?.title ?? 'Document' },
      ]}
      title={note?.title ?? 'Loading document…'}
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
          <Text c="dimmed">Loading document…</Text>
        </Paper>
      )}

      {note && (
        <>
          <div className={styles.noteLayout}>
            <div className={styles.noteMain}>
              <Paper className={styles.documentIntro} withBorder radius="lg">
                <div className={styles.documentIntroCover}>
                  {cover ? (
                    <img src={cover} alt="" />
                  ) : (
                    <div className={styles.coverPlaceholderLarge}>
                      <IconFileDescription size={48} stroke={1.2} />
                    </div>
                  )}
                  <span className={styles.coverPageCount}>
                    {note.pages.length} page{note.pages.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className={styles.documentIntroCopy}>
                  <Group gap="xs" mb="md">
                    <Badge color="brand" variant="light">
                      {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
                    </Badge>
                    <Badge color="green" variant="light">
                      Reviewed
                    </Badge>
                    <Badge color="gray" variant="outline">
                      Pilot access
                    </Badge>
                  </Group>

                  <Title order={2} className={styles.noteTitle}>
                    {note.title}
                  </Title>
                  <Text size="sm" c="dimmed" mt={8}>
                    {note.courseCode} · {note.courseName}
                  </Text>

                  {note.description && (
                    <Text size="sm" c="dimmed" mt="md" lh={1.7}>
                      {note.description}
                    </Text>
                  )}

                  <Group gap="lg" mt="lg" wrap="wrap">
                    <Group gap={6}>
                      <IconUser size={15} />
                      <Text size="xs" c="dimmed">
                        {note.contributorName ?? 'DigitalNotes contributor'}
                      </Text>
                    </Group>
                    <Group gap={6}>
                      <IconCalendar size={15} />
                      <Text size="xs" c="dimmed">
                        Updated {formatDate(note.updatedAt)}
                      </Text>
                    </Group>
                    <Group gap={6}>
                      <IconPhoto size={15} />
                      <Text size="xs" c="dimmed">
                        {note.pages.length} pages
                      </Text>
                    </Group>
                  </Group>

                  <Group gap="sm" mt="xl">
                    <Button
                      color="brand"
                      leftSection={<IconBook2 size={17} />}
                      onClick={scrollToPages}
                    >
                      Read document
                    </Button>
                    <Button
                      component="a"
                      href={`${STUDENT_APP_URL}/notes/${noteId}`}
                      variant="outline"
                      color="gray"
                      leftSection={<IconBookmark size={16} />}
                    >
                      Save to library
                    </Button>
                    <Tooltip label={copied ? 'Link copied' : 'Copy link'} withArrow>
                      <ActionIcon
                        variant="outline"
                        color="gray"
                        size="lg"
                        aria-label="Copy document link"
                        onClick={copyLink}
                      >
                        {copied ? <IconCheck size={17} /> : <IconCopy size={17} />}
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      component="a"
                      href={cover ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      variant="subtle"
                      color="gray"
                      leftSection={<IconDownload size={16} />}
                      disabled={!cover}
                    >
                      Open original
                    </Button>
                  </Group>
                </div>
              </Paper>

              <div id="note-pages" className={styles.pagesSection}>
                <Group justify="space-between" align="flex-end" mb="md">
                  <div>
                    <Text className={styles.eyebrow}>Document preview</Text>
                    <Title order={3} className={styles.pagesTitle}>
                      Every page, ready to read
                    </Title>
                  </div>
                  <Text size="xs" c="dimmed">
                    Click a page to enlarge
                  </Text>
                </Group>

                {note.pages.length === 0 ? (
                  <EmptyState
                    icon={<IconFileDescription size={26} />}
                    title="No pages available"
                    description="This note does not have any viewable pages yet."
                  />
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                    {note.pages.map((page, index) => (
                      <button
                        key={page.id}
                        type="button"
                        className={styles.pageThumb}
                        onClick={() => setViewerIndex(index)}
                        aria-label={`Open page ${index + 1}`}
                      >
                        {page.url && page.mimeType?.startsWith('image/') ? (
                          <img src={page.url} alt={`Page ${index + 1}`} loading="lazy" />
                        ) : (
                          <div className={styles.pageThumbFallback}>
                            <IconFileDescription size={32} />
                            <span>Preview unavailable</span>
                          </div>
                        )}
                        <div className={styles.pageThumbFooter}>
                          <span>Page {index + 1}</span>
                          <span className={styles.pageZoom}>
                            <IconZoomIn size={14} /> Enlarge
                          </span>
                        </div>
                      </button>
                    ))}
                  </SimpleGrid>
                )}
              </div>
            </div>

            <aside className={styles.noteSidebar}>
              <Paper className={styles.accessCard} withBorder radius="lg" p="lg">
                <Text className={styles.eyebrow}>Access</Text>
                <Group justify="space-between" align="center" mt="xs">
                  <Text className={styles.priceLarge}>{formatPrice(note.price)}</Text>
                  <Badge color="green" variant="light">
                    Pilot access
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" mt="sm" lh={1.6}>
                  Free access during the pilot. Paid access will be enabled when the marketplace
                  launches.
                </Text>
                <Button
                  fullWidth
                  mt="md"
                  color="brand"
                  leftSection={<IconBook2 size={16} />}
                  onClick={scrollToPages}
                >
                  Open document
                </Button>
              </Paper>

              <Paper className={styles.detailCard} withBorder radius="lg" p="lg">
                <Text className={styles.eyebrow}>About this document</Text>
                <Stack gap="sm" mt="md">
                  <DetailRow
                    icon={<IconBook2 size={15} />}
                    label="Course"
                    value={
                      <Link
                        to="/courses/$courseId"
                        params={{ courseId: note.courseId }}
                        className={styles.detailLink}
                      >
                        {note.courseCode}
                      </Link>
                    }
                  />
                  {note.courseDepartmentId && (
                    <DetailRow
                      icon={<IconFileDescription size={15} />}
                      label="Department"
                      value={
                        <Link
                          to="/departments/$departmentId"
                          params={{ departmentId: note.courseDepartmentId }}
                          className={styles.detailLink}
                        >
                          {note.courseDepartmentName}
                        </Link>
                      }
                    />
                  )}
                  {note.courseLevelName && (
                    <DetailRow
                      icon={<IconBook2 size={15} />}
                      label="Level"
                      value={note.courseLevelName}
                    />
                  )}
                  {note.courseSemesterName && (
                    <DetailRow
                      icon={<IconCalendar size={15} />}
                      label="Semester"
                      value={note.courseSemesterName}
                    />
                  )}
                  <DetailRow
                    icon={<IconPhoto size={15} />}
                    label="Pages"
                    value={String(note.pages.length)}
                  />
                  <DetailRow
                    icon={<IconClock size={15} />}
                    label="Published"
                    value={formatDate(note.publishedAt)}
                  />
                </Stack>
              </Paper>

              <Paper className={styles.contributorCard} withBorder radius="lg" p="lg">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon size={42} radius="xl" color="brand" variant="light">
                    <Text size="sm" fw={700}>
                      {getInitials(note.contributorName ?? 'DigitalNotes')}
                    </Text>
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="sm">
                      {note.contributorName ?? 'DigitalNotes contributor'}
                    </Text>
                    <Group gap={4} mt={2}>
                      <IconCheck size={12} />
                      <Text size="xs" c="dimmed">
                        Reviewed contributor
                      </Text>
                    </Group>
                  </div>
                </Group>
                <Text size="xs" c="dimmed" mt="md" lh={1.65}>
                  This document was prepared for the course and reviewed by the DigitalNotes
                  team before publication.
                </Text>
              </Paper>
            </aside>
          </div>

          <Divider my={{ base: 36, md: 56 }} />

          <SectionHeading
            eyebrow="Keep studying"
            title="More from this course"
            description={`Other reviewed documents in ${note.courseName}.`}
            action={
              <Button
                component={Link}
                to="/courses/$courseId"
                params={{ courseId: note.courseId } as never}
                variant="subtle"
                color="brand"
                rightSection={<IconArrowRight size={16} />}
              >
                Open course
              </Button>
            }
          />
          {relatedQuery.isPending ? null : relatedNotes.length > 0 ? (
            <DocumentGrid notes={relatedNotes} />
          ) : (
            <EmptyState
              icon={<IconBook2 size={26} />}
              title="No other documents yet"
              description="This is the only published document for this course at the moment."
            />
          )}
        </>
      )}

      <Modal
        opened={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
        size="xl"
        centered
        title={viewerPage ? `Page ${viewerIndex! + 1} of ${note?.pages.length}` : 'Page preview'}
        classNames={{ body: styles.viewerBody }}
      >
        {viewerPage?.url ? (
          <>
            <img
              src={viewerPage.url}
              alt={`Page ${(viewerIndex ?? 0) + 1}`}
              className={styles.viewerImage}
            />
            <Group justify="center" gap="md" mt="md">
              <Button
                variant="default"
                leftSection={<IconArrowLeft size={16} />}
                disabled={(viewerIndex ?? 0) === 0}
                onClick={() => setViewerIndex((index) => Math.max(0, (index ?? 0) - 1))}
              >
                Previous
              </Button>
              <Button
                variant="default"
                rightSection={<IconArrowRight size={16} />}
                disabled={(viewerIndex ?? 0) >= (note?.pages.length ?? 1) - 1}
                onClick={() =>
                  setViewerIndex((index) =>
                    Math.min((note?.pages.length ?? 1) - 1, (index ?? 0) + 1)
                  )
                }
              >
                Next
              </Button>
            </Group>
          </>
        ) : (
          <Text c="dimmed">This page has no preview.</Text>
        )}
      </Modal>
    </CataloguePage>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: Readonly<{ icon: React.ReactNode; label: string; value: React.ReactNode }>) {
  return (
    <Group justify="space-between" gap="md" wrap="nowrap">
      <Group gap={7} wrap="nowrap">
        <span className={styles.detailIcon}>{icon}</span>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
      </Group>
      <Text size="xs" fw={600} ta="right">
        {value}
      </Text>
    </Group>
  )
}

export default NotePage

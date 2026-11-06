import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowUpRight,
  IconBook2,
  IconBuildingBank,
  IconChevronRight,
  IconFileDescription,
  IconFolder,
  IconNotebook,
  IconPencil,
  IconSchool,
  IconSearch,
  IconSparkles,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  formatDate,
  formatPrice,
  getInitials,
  NOTE_TYPES,
  type CourseNote,
  type NoteTypeMeta,
  type PublicNote,
} from './types'
import styles from './catalogue.module.scss'

export type Crumb = {
  label: string
  to?: string
  params?: Record<string, string>
}

export const BREADCRUMB_HOME: Crumb = { label: 'Home', to: '/' }

export function CataloguePage({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
}: Readonly<{
  breadcrumbs: Crumb[]
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}>) {
  return (
    <main className={styles.page}>
      <Container size="xl" className={styles.pageInner}>
        <Breadcrumbs
          separator={<IconChevronRight size={12} />}
          separatorMargin={6}
          className={styles.breadcrumbs}
          mb="xl"
        >
          {breadcrumbs.map((crumb) =>
            crumb.to ? (
              <Link
                key={crumb.label}
                to={crumb.to as never}
                params={crumb.params as never}
                className={styles.crumbLink}
              >
                {crumb.label}
              </Link>
            ) : (
              <Text key={crumb.label} size="xs" className={styles.crumbCurrent}>
                {crumb.label}
              </Text>
            )
          )}
        </Breadcrumbs>

        <header className={styles.pageHeader}>
          <Box className={styles.pageHeaderCopy}>
            {eyebrow && <Text className={styles.eyebrow}>{eyebrow}</Text>}
            <Title order={1} className={styles.pageTitle}>
              {title}
            </Title>
            {description && (
              <Text size="md" c="dimmed" mt={10} maw={720} lh={1.65}>
                {description}
              </Text>
            )}
          </Box>
          {actions && <Box className={styles.pageActions}>{actions}</Box>}
        </header>

        {children}
      </Container>
    </main>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: Readonly<{
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}>) {
  return (
    <Group justify="space-between" align="flex-end" mb="lg" wrap="wrap" gap="md">
      <Box>
        {eyebrow && (
          <Group gap={8} mb={6}>
            <span className={styles.eyebrowLine} />
            <Text className={styles.eyebrow}>{eyebrow}</Text>
          </Group>
        )}
        <Title order={2} className={styles.sectionTitle}>
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed" mt={6} maw={620}>
            {description}
          </Text>
        )}
      </Box>
      {action}
    </Group>
  )
}

type EntityKind = 'university' | 'faculty' | 'department'

const ENTITY_META: Record<
  EntityKind,
  {
    label: string
    plural: string
    action: string
    icon: typeof IconBuildingBank
    tone: string
  }
> = {
  university: {
    label: 'University',
    plural: 'universities',
    action: 'Explore faculties',
    icon: IconBuildingBank,
    tone: styles.toneBrand,
  },
  faculty: {
    label: 'Faculty',
    plural: 'faculties',
    action: 'Explore departments',
    icon: IconSchool,
    tone: styles.toneViolet,
  },
  department: {
    label: 'Department',
    plural: 'departments',
    action: 'Explore courses',
    icon: IconFolder,
    tone: styles.toneAmber,
  },
}

export function EntityGrid({
  kind,
  items,
  getLink,
}: Readonly<{
  kind: EntityKind
  items: Array<{ id: string; name: string; meta?: string }>
  getLink: (item: { id: string }) => { to: string; params?: Record<string, string> }
}>) {
  const meta = ENTITY_META[kind]
  const Icon = meta.icon

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Icon size={26} stroke={1.6} />}
        title={`No ${meta.plural} yet`}
        description="The catalogue is still being populated. Check back soon."
      />
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {items.map((item, index) => {
        const link = getLink(item)
        return (
          <Link
            key={item.id}
            to={link.to as never}
            params={link.params as never}
            className={styles.entityLink}
          >
            <Paper className={styles.entityCard} withBorder radius="lg">
              <div className={styles.entityCardTop}>
                <span className={styles.entityIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Group gap={6}>
                  <Icon size={14} stroke={1.8} />
                  <span className={styles.entityKind}>{meta.label}</span>
                </Group>
                <IconArrowUpRight size={17} className={styles.entityArrow} />
              </div>

              <Box className={`${styles.entityAvatar} ${meta.tone}`}>{getInitials(item.name)}</Box>

              <Title order={3} className={styles.entityName} lineClamp={2}>
                {item.name}
              </Title>
              {item.meta && (
                <Text size="xs" c="dimmed" mt={6} lineClamp={1}>
                  {item.meta}
                </Text>
              )}

              <div className={styles.entityFooter}>
                <span>{meta.action}</span>
                <IconArrowUpRight size={14} />
              </div>
            </Paper>
          </Link>
        )
      })}
    </SimpleGrid>
  )
}

export function CourseGrid({
  courses,
}: Readonly<{
  courses: Array<{
    id: string
    code: string
    name: string
    lecturerName?: string | null
    levelName?: string
    semesterName?: string
  }>
}>) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<IconBook2 size={26} stroke={1.6} />}
        title="No courses found"
        description="Try another level or semester, or check back once the catalogue is updated."
      />
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {courses.map((course, index) => (
        <Link
          key={course.id}
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className={styles.entityLink}
        >
          <Paper className={styles.courseCard} withBorder radius="lg">
            <div className={styles.courseCardTop}>
              <span className={styles.courseIndex}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <Badge className={styles.codeBadge} variant="light">
                {course.code}
              </Badge>
              <IconArrowUpRight size={17} className={styles.entityArrow} />
            </div>

            <Title order={3} className={styles.courseName} lineClamp={2}>
              {course.name}
            </Title>

            {course.lecturerName && (
              <Text size="xs" c="dimmed" mt={8}>
                {course.lecturerName}
              </Text>
            )}

            <div className={styles.courseTags}>
              {course.levelName && <span>{course.levelName}</span>}
              {course.semesterName && <span>{course.semesterName}</span>}
            </div>

            <div className={styles.entityFooter}>
              <span>Open course</span>
              <IconArrowUpRight size={14} />
            </div>
          </Paper>
        </Link>
      ))}
    </SimpleGrid>
  )
}

type DocumentItem = Pick<
  CourseNote,
  'id' | 'title' | 'noteType' | 'price' | 'pageCount' | 'updatedAt'
> & {
  coverUrl?: string | null
  courseCode?: string
  courseName?: string
  contributorName?: string | null
  publishedAt?: string | null
}

const NOTE_TYPE_ICONS: Record<string, typeof IconBook2> = {
  LECTURE_NOTES: IconNotebook,
  SUMMARY: IconSparkles,
  REVISION: IconBook2,
  PAST_EXAM: IconFileDescription,
  EXERCISES: IconPencil,
}

export function DocumentCard({
  note,
  eager = false,
}: Readonly<{ note: DocumentItem; eager?: boolean }>) {
  const type = NOTE_TYPES.find((item) => item.value === note.noteType)
  const TypeIcon = NOTE_TYPE_ICONS[note.noteType] ?? IconFileDescription

  return (
    <Link
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className={styles.documentLink}
    >
      <article className={styles.documentCard}>
        <div className={styles.documentCover}>
          {note.coverUrl ? (
            <img
              src={note.coverUrl}
              alt=""
              loading={eager ? 'eager' : 'lazy'}
              className={styles.documentCoverImage}
            />
          ) : (
            <div className={styles.documentPlaceholder}>
              <TypeIcon size={36} stroke={1.3} />
              <span>{note.courseCode ?? 'DigitalNotes'}</span>
            </div>
          )}

          <span className={styles.documentType}>
            {type?.shortLabel ?? note.noteType}
          </span>
          <span className={styles.documentPages}>
            {note.pageCount} page{note.pageCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className={styles.documentBody}>
          <div className={styles.documentKicker}>
            <span>{note.courseCode ?? 'Course note'}</span>
            <span className={styles.documentPrice}>{formatPrice(note.price)}</span>
          </div>
          <Title order={3} className={styles.documentTitle} lineClamp={2}>
            {note.title}
          </Title>
          {note.courseName && (
            <Text size="xs" c="dimmed" mt={6} lineClamp={1}>
              {note.courseName}
            </Text>
          )}
          <div className={styles.documentMeta}>
            <span>{note.contributorName ?? 'Verified contributor'}</span>
            <span>{formatDate(note.publishedAt ?? note.updatedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function DocumentGrid({ notes }: Readonly<{ notes: DocumentItem[] }>) {
  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<IconFileDescription size={26} stroke={1.6} />}
        title="No documents found"
        description="Try a different search or document type, or explore another course."
      />
    )
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {notes.map((note) => (
        <DocumentCard key={note.id} note={note} />
      ))}
    </SimpleGrid>
  )
}

export function NoteTypeTiles({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className={compact ? styles.typeGridCompact : styles.typeGrid}>
      {NOTE_TYPES.map((type) => (
        <NoteTypeTile key={type.value} type={type} />
      ))}
    </div>
  )
}

function NoteTypeTile({ type }: { type: NoteTypeMeta }) {
  const Icon = NOTE_TYPE_ICONS[type.value] ?? IconFileDescription

  return (
    <Link
      to="/browse"
      search={{ type: type.value } as never}
      className={styles.typeTile}
    >
      <ThemeIcon variant="light" color="brand" size={40} radius="md">
        <Icon size={20} stroke={1.7} />
      </ThemeIcon>
      <div>
        <Text fw={700} className={styles.typeTileTitle}>
          {type.label}
        </Text>
        <Text size="xs" c="dimmed" mt={4} lh={1.5}>
          {type.description}
        </Text>
      </div>
      <IconArrowUpRight size={16} className={styles.typeTileArrow} />
    </Link>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: Readonly<{
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}>) {
  return (
    <Paper className={styles.emptyState} withBorder radius="lg" p="xl">
      <ThemeIcon variant="light" color="brand" size={56} radius="xl">
        {icon}
      </ThemeIcon>
      <Title order={3} mt="md">
        {title}
      </Title>
      <Text size="sm" c="dimmed" ta="center" maw={420} mt={6}>
        {description}
      </Text>
      {action && <Box mt="md">{action}</Box>}
    </Paper>
  )
}

export function GridSkeleton({ count = 8 }: Readonly<{ count?: number }>) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          <Skeleton height={300} radius="md" />
          <Skeleton height={12} width="40%" mt="md" />
          <Skeleton height={18} width="85%" mt="sm" />
          <Skeleton height={12} width="60%" mt="sm" />
        </Box>
      ))}
    </SimpleGrid>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  size = 'md',
}: Readonly<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}>) {
  return (
    <Box className={`${styles.searchWrap} ${styles[`search${size}`]}`}>
      <IconSearch size={size === 'lg' ? 20 : 16} className={styles.searchIcon} />
      <input
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label={placeholder}
      />
    </Box>
  )
}

export function BackLink({
  to,
  params,
  label,
}: Readonly<{ to: string; params?: Record<string, string>; label: string }>) {
  return (
    <Button
      component={Link}
      to={to as never}
      params={params as never}
      variant="subtle"
      color="gray"
      size="sm"
      leftSection={<IconChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />}
      className={styles.backLink}
    >
      {label}
    </Button>
  )
}

export function PublicNoteGrid({ notes }: Readonly<{ notes: PublicNote[] }>) {
  return <DocumentGrid notes={notes} />
}

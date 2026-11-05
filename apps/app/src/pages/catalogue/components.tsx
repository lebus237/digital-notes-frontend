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
  IconFolder,
  IconSchool,
  IconSearch,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { formatPrice, getInitials, NOTE_TYPE_LABELS } from './types'
import styles from './catalogue.module.scss'

export type Crumb = {
  label: string
  to?: string
  params?: Record<string, string>
}

export const BREADCRUMB_HOME: Crumb = { label: 'Home', to: '/' }

export function CataloguePage({
  breadcrumbs,
  title,
  description,
  actions,
  children,
}: Readonly<{
  breadcrumbs: Crumb[]
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}>) {
  return (
    <main className={styles.page}>
      <Container size="lg" py={{ base: 'lg', md: 48 }}>
        <Breadcrumbs
          separator={<IconChevronRight size={13} />}
          separatorMargin={6}
          className={styles.breadcrumbs}
          mb="lg"
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
              <Text key={crumb.label} size="sm" c="dimmed">
                {crumb.label}
              </Text>
            )
          )}
        </Breadcrumbs>

        <Group justify="space-between" align="flex-end" gap="lg" mb="xl" wrap="wrap">
          <Box>
            <Title order={1} className={styles.pageTitle}>
              {title}
            </Title>
            {description && (
              <Text size="md" c="dimmed" mt={8} maw={680}>
                {description}
              </Text>
            )}
          </Box>
          {actions}
        </Group>

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
    <Group justify="space-between" align="flex-end" mb="md" wrap="wrap" gap="md">
      <Box>
        {eyebrow && <Text className={styles.eyebrow}>{eyebrow}</Text>}
        <Title order={2} className={styles.sectionTitle}>
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed" mt={4}>
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
  { label: string; icon: typeof IconBuildingBank; tone: string }
> = {
  university: { label: 'University', icon: IconBuildingBank, tone: styles.toneBrand },
  faculty: { label: 'Faculty', icon: IconSchool, tone: styles.toneViolet },
  department: { label: 'Department', icon: IconFolder, tone: styles.toneAmber },
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
        title={`No ${kind}s yet`}
        description="The catalogue is still being populated. Check back soon."
      />
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {items.map((item) => {
        const link = getLink(item)
        return (
          <Link
            key={item.id}
            to={link.to as never}
            params={link.params as never}
            className={styles.entityLink}
          >
            <Paper className={styles.entityCard} withBorder radius="lg" p="md">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Box className={`${styles.entityAvatar} ${meta.tone}`}>
                  {getInitials(item.name)}
                </Box>
                <IconArrowUpRight size={18} className={styles.entityArrow} />
              </Group>
              <Text className={styles.entityKind} mt="md">
                {meta.label}
              </Text>
              <Title order={3} className={styles.entityName} lineClamp={2}>
                {item.name}
              </Title>
              {item.meta && (
                <Text size="xs" c="dimmed" mt={6} lineClamp={1}>
                  {item.meta}
                </Text>
              )}
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
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {courses.map((course) => (
        <Link
          key={course.id}
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className={styles.entityLink}
        >
          <Paper className={styles.courseCard} withBorder radius="lg" p="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Badge variant="light" color="brand" size="sm">
                {course.code}
              </Badge>
              <IconArrowUpRight size={18} className={styles.entityArrow} />
            </Group>
            <Title order={3} className={styles.courseName} mt="md" lineClamp={2}>
              {course.name}
            </Title>
            {course.lecturerName && (
              <Text size="xs" c="dimmed" mt={6}>
                {course.lecturerName}
              </Text>
            )}
            <Group gap={6} mt="md">
              {course.levelName && (
                <Badge variant="outline" color="gray" size="xs">
                  {course.levelName}
                </Badge>
              )}
              {course.semesterName && (
                <Badge variant="outline" color="gray" size="xs">
                  {course.semesterName}
                </Badge>
              )}
            </Group>
          </Paper>
        </Link>
      ))}
    </SimpleGrid>
  )
}

export function NoteGrid({
  notes,
}: Readonly<{
  notes: Array<{
    id: string
    title: string
    noteType: string
    price: number
    pageCount: number
    updatedAt: string
  }>
}>) {
  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<IconBook2 size={26} stroke={1.6} />}
        title="No notes published yet"
        description="The course exists, but no material has been approved for it yet."
      />
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {notes.map((note) => (
        <Link
          key={note.id}
          to="/notes/$noteId"
          params={{ noteId: note.id }}
          className={styles.entityLink}
        >
          <Paper className={styles.noteCard} withBorder radius="lg" p="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Badge variant="light" color="brand" size="sm">
                {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
              </Badge>
              <IconArrowUpRight size={18} className={styles.entityArrow} />
            </Group>
            <Title order={3} className={styles.courseName} mt="md" lineClamp={2}>
              {note.title}
            </Title>
            <Group justify="space-between" mt="md">
              <Text size="sm" fw={600} c="brand.7">
                {formatPrice(note.price)}
              </Text>
              <Text size="xs" c="dimmed">
                {note.pageCount} page{note.pageCount === 1 ? '' : 's'}
              </Text>
            </Group>
          </Paper>
        </Link>
      ))}
    </SimpleGrid>
  )
}

export function EmptyState({
  icon,
  title,
  description,
}: Readonly<{
  icon: ReactNode
  title: string
  description: string
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
    </Paper>
  )
}

export function GridSkeleton({ count = 6 }: Readonly<{ count?: number }>) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {Array.from({ length: count }).map((_, index) => (
        <Paper key={index} className={styles.entityCard} withBorder radius="lg" p="md">
          <Skeleton height={52} width={52} radius="md" />
          <Skeleton height={10} width="35%" mt="lg" />
          <Skeleton height={20} width="80%" mt="sm" />
          <Skeleton height={12} width="55%" mt="sm" />
        </Paper>
      ))}
    </SimpleGrid>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
}: Readonly<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
}>) {
  return (
    <Box className={styles.searchWrap}>
      <IconSearch size={16} className={styles.searchIcon} />
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

export function BackLink({ to, params, label }: Readonly<{ to: string; params?: Record<string, string>; label: string }>) {
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

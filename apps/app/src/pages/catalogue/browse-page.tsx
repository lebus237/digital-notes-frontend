import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Pagination,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { IconArrowRight, IconCheck, IconSearch, IconX } from '@tabler/icons-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState, type FormEvent } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { listPublicNotes } from '@/shared/api/endpoints'
import { DocumentGrid, EmptyState, GridSkeleton } from './components'
import { NOTE_TYPES, type PublicNote } from './types'
import styles from './catalogue.module.scss'

const PAGE_SIZE = 24

export function BrowsePage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/browse' })
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const type = typeof searchParams.type === 'string' ? searchParams.type : ''
  const page = typeof searchParams.page === 'number' ? searchParams.page : 1
  const [search, setSearch] = useState(q)

  useEffect(() => {
    setSearch(q)
  }, [q])

  const notesQuery = useQuery({
    queryKey: ['browse-notes', q, type, page],
    queryFn: () =>
      listPublicNotes({
        limit: PAGE_SIZE,
        page,
        ...(q ? { q } : {}),
        ...(type ? { noteType: type } : {}),
      }),
    select: (payload) => normalizeCollectionResponse<PublicNote>(payload),
    placeholderData: (previous) => previous,
  })

  const documents = notesQuery.data?.data ?? []
  const total = notesQuery.data?.meta.pagination.total ?? 0
  const lastPage = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1
  const activeType = NOTE_TYPES.find((item) => item.value === type)

  const goTo = (next: { q?: string; type?: string; page?: number }) => {
    const nextQ = next.q !== undefined ? next.q : q
    const nextType = next.type !== undefined ? next.type : type
    const nextPage = next.page ?? 1
    navigate({
      to: '/browse',
      search: {
        ...(nextQ ? { q: nextQ } : {}),
        ...(nextType ? { type: nextType } : {}),
        ...(nextPage > 1 ? { page: nextPage } : {}),
      } as never,
    })
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    goTo({ q: search.trim(), page: 1 })
  }

  const clearFilters = () => {
    setSearch('')
    navigate({ to: '/browse', search: {} })
  }

  return (
    <main className={styles.browsePage}>
      <section className={styles.browseHero}>
        <Container size="xl">
          <Box className={styles.browseHeroInner}>
            <Text className={styles.eyebrow}>Explore the library</Text>
            <Title order={1} className={styles.browseTitle}>
              Find the document
              <br />
              <em>you actually need.</em>
            </Title>
            <Text size="md" c="dimmed" mt="sm" maw={580}>
              Search by course, code or title. Filter by document type and open a reviewed note
              in seconds.
            </Text>

            <form className={styles.browseSearch} onSubmit={submitSearch}>
              <IconSearch size={19} className={styles.browseSearchIcon} />
              <input
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search courses, codes or note titles…"
                aria-label="Search documents"
              />
              <Button type="submit" color="brand" radius="sm">
                Search
              </Button>
            </form>
          </Box>
        </Container>
      </section>

      <Container size="xl" className={styles.browseBody}>
        <div className={styles.browseLayout}>
          <aside className={styles.browseSidebar}>
            <div className={styles.sidebarBlock}>
              <Text className={styles.sidebarTitle}>Document type</Text>
              <div className={styles.filterList}>
                <button
                  type="button"
                  className={!type ? styles.filterActive : styles.filterItem}
                  onClick={() => goTo({ type: '', page: 1 })}
                >
                  <span>All documents</span>
                  <IconArrowRight size={14} />
                </button>
                {NOTE_TYPES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={type === item.value ? styles.filterActive : styles.filterItem}
                    onClick={() => goTo({ type: item.value, page: 1 })}
                  >
                    <span>{item.label}</span>
                    <IconArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <Divider my="lg" />

            <Paper className={styles.sidebarNote} radius="md">
              <Group gap={7} mb={8}>
                <IconCheck size={15} />
                <Text size="sm" fw={700}>
                  Pilot access
                </Text>
              </Group>
              <Text size="xs" c="dimmed" lh={1.65}>
                Every document is free while DigitalNotes is in its pilot phase. Open any note
                and start reading.
              </Text>
            </Paper>
          </aside>

          <section className={styles.browseResults}>
            <Group justify="space-between" align="flex-end" mb="lg" wrap="wrap">
              <Box>
                <Group gap="xs" mb={4}>
                  <Text className={styles.resultsKicker}>
                    {activeType?.label ?? (q ? 'Search results' : 'All documents')}
                  </Text>
                  {(q || type) && (
                    <button type="button" className={styles.clearButton} onClick={clearFilters}>
                      <IconX size={12} /> Clear
                    </button>
                  )}
                </Group>
                <Title order={2} className={styles.resultsTitle}>
                  {q ? `“${q}”` : activeType?.label ?? 'The whole library'}
                </Title>
                <Text size="xs" c="dimmed" mt={4}>
                  {notesQuery.isPending
                    ? 'Loading documents…'
                    : `${total} document${total === 1 ? '' : 's'} found`}
                </Text>
              </Box>
              <Text size="xs" c="dimmed" className={styles.sortNote}>
                Sorted by newest publication
              </Text>
            </Group>

            {notesQuery.isPending ? (
              <GridSkeleton count={8} />
            ) : documents.length > 0 ? (
              <>
                <DocumentGrid notes={documents} />
                {lastPage > 1 && (
                  <Group justify="center" mt={48}>
                    <Pagination
                      total={lastPage}
                      value={page}
                      onChange={(nextPage) => goTo({ page: nextPage })}
                      color="brand"
                      radius="md"
                    />
                  </Group>
                )}
              </>
            ) : (
              <EmptyState
                icon={<IconSearch size={26} />}
                title="Nothing matches that search"
                description="Try a different course code, a shorter keyword or explore all documents."
                action={
                  <Button variant="light" color="brand" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            )}
          </section>
        </div>
      </Container>
    </main>
  )
}

export default BrowsePage

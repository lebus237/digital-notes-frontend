import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBook2,
  IconCheck,
  IconFileDescription,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  listCourses,
  listDepartments,
  listPublicNotes,
  listUniversities,
} from '@/shared/api/endpoints'
import {
  DocumentGrid,
  EntityGrid,
  GridSkeleton,
  NoteTypeTiles,
  SectionHeading,
} from './components'
import type { Department, PublicNote, University } from './types'
import styles from './catalogue.module.scss'

const STEPS = [
  {
    number: '01',
    title: 'Find your programme',
    text: 'Start from your university, then move through your faculty and department.',
  },
  {
    number: '02',
    title: 'Open your course',
    text: 'Filter by level and semester to land on the exact course you are studying.',
  },
  {
    number: '03',
    title: 'Study from reviewed notes',
    text: 'Every document is checked before publication, so you can focus on the material.',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const notesQuery = useQuery({
    queryKey: ['home-notes'],
    queryFn: () => listPublicNotes({ limit: 8 }),
    select: (payload) => normalizeCollectionResponse<PublicNote>(payload),
  })

  const universitiesQuery = useQuery({
    queryKey: ['home-universities'],
    queryFn: () => listUniversities({ limit: 100 }),
    select: (payload) => normalizeCollectionResponse<University>(payload),
  })

  const departmentsQuery = useQuery({
    queryKey: ['home-departments'],
    queryFn: () => listDepartments({ limit: 100 }),
    select: (payload) => normalizeCollectionResponse<Department>(payload),
  })

  const coursesQuery = useQuery({
    queryKey: ['home-course-count'],
    queryFn: () => listCourses({ limit: 1 }),
    select: (payload) => normalizeCollectionResponse(payload).meta.pagination.total,
  })

  const documents = notesQuery.data?.data ?? []
  const universities = universitiesQuery.data?.data ?? []
  const departments = departmentsQuery.data?.data ?? []
  const totalNotes = notesQuery.data?.meta.pagination.total ?? 0
  const totalUniversities = universitiesQuery.data?.meta.pagination.total ?? 0
  const totalCourses = coursesQuery.data ?? 0
  const featured = documents.filter((document) => document.coverUrl).slice(0, 3)

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const q = search.trim()
    navigate({ to: '/browse', search: q ? { q } : {} })
  }

  const openSearch = (q: string) => {
    navigate({ to: '/browse', search: { q } })
  }

  return (
    <main className={styles.homePage}>
      <section className={styles.homeHero}>
        <Box className={styles.heroGlowOne} aria-hidden />
        <Box className={styles.heroGlowTwo} aria-hidden />
        <Container size="xl" className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <Group gap={8} className={styles.heroKicker}>
                <span className={styles.heroKickerDot} />
                <Text>THE ACADEMIC LIBRARY FOR YOUR SEMESTER</Text>
              </Group>

              <Title className={styles.heroDisplay}>
                Course notes,
                <br />
                <em>without the chaos.</em>
              </Title>

              <Text className={styles.heroLead}>
                Find reviewed lecture notes, revision sheets and past exams for your exact
                course. Organised from university to final page.
              </Text>

              <form className={styles.heroSearch} onSubmit={submitSearch}>
                <IconSearch size={21} className={styles.heroSearchIcon} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search a course, a code or a note title…"
                  aria-label="Search the catalogue"
                />
                <Button type="submit" color="brand" radius="md" size="md">
                  Search
                </Button>
              </form>

              <Group gap={8} className={styles.quickSearches} wrap="wrap">
                <Text size="xs" className={styles.quickLabel}>
                  Popular now
                </Text>
                {['Algorithmique', 'Mathématiques discrètes', 'Développement web'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={styles.quickChip}
                    onClick={() => openSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </Group>

              <Group gap="lg" className={styles.heroTrust} wrap="wrap">
                <Group gap={7}>
                  <IconShieldCheck size={16} />
                  <Text size="xs">Reviewed before publishing</Text>
                </Group>
                <Group gap={7}>
                  <IconCheck size={16} />
                  <Text size="xs">Free during pilot</Text>
                </Group>
              </Group>
            </div>

            <div className={styles.heroVisual} aria-label="Featured document covers">
              <div className={styles.coverStage}>
                {featured.length > 0 ? (
                  featured.map((document, index) => (
                    <div
                      key={document.id}
                      className={`${styles.heroCover} ${styles[`heroCover${index + 1}`]}`}
                    >
                      <img src={document.coverUrl ?? ''} alt="" loading="eager" />
                      <div className={styles.heroCoverMeta}>
                        <span>{document.courseCode}</span>
                        <span>{document.pageCount} pages</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className={`${styles.heroCover} ${styles.heroCover1}`}>
                      <div className={styles.heroCoverFallback}>
                        <IconBook2 size={42} />
                        <span>INF101</span>
                      </div>
                    </div>
                    <div className={`${styles.heroCover} ${styles.heroCover2}`}>
                      <div className={styles.heroCoverFallback}>
                        <IconFileDescription size={42} />
                        <span>MAT101</span>
                      </div>
                    </div>
                    <div className={`${styles.heroCover} ${styles.heroCover3}`}>
                      <div className={styles.heroCoverFallback}>
                        <IconSparkles size={42} />
                        <span>WEB201</span>
                      </div>
                    </div>
                  </>
                )}

                <Paper className={styles.heroTrustCard} shadow="md" radius="md">
                  <div className={styles.heroTrustIcon}>
                    <IconCheck size={16} />
                  </div>
                  <div>
                    <Text fw={700} size="sm">
                      Ready for your exam season
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {totalNotes > 0
                        ? `${totalNotes} reviewed documents and counting`
                        : 'Documents reviewed by the team'}
                    </Text>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.statBar}>
        <Container size="xl">
          <div className={styles.statGrid}>
            <Stat value={totalNotes || '—'} label="Reviewed documents" />
            <Stat value={totalCourses || '—'} label="Courses covered" />
            <Stat value={totalUniversities || '—'} label="Universities" />
            <Stat value="100%" label="Free during pilot" accent />
          </div>
        </Container>
      </section>

      <section className={styles.homeSection} id="trending">
        <Container size="xl">
          <SectionHeading
            eyebrow="Trending now"
            title="Documents students are opening"
            description="The most recent additions to the library, ready to read."
            action={
              <Button
                component={Link}
                to="/browse"
                variant="subtle"
                color="brand"
                rightSection={<IconArrowRight size={16} />}
              >
                Explore all documents
              </Button>
            }
          />
          {notesQuery.isPending ? (
            <GridSkeleton count={4} />
          ) : (
            <DocumentGrid notes={documents.slice(0, 4)} />
          )}
        </Container>
      </section>

      <section className={`${styles.homeSection} ${styles.homeSectionTint}`} id="document-types">
        <Container size="xl">
          <SectionHeading
            eyebrow="Choose your format"
            title="A document for every study moment"
            description="From complete course notes to last-minute revision, the library adapts to how you work."
          />
          <NoteTypeTiles />
        </Container>
      </section>

      <section className={styles.homeSection} id="universities">
        <Container size="xl">
          <SectionHeading
            eyebrow="Your campus, organised"
            title="Start with your university"
            description="Browse the same structure as your programme, from faculty to course."
            action={
              <Button
                component={Link}
                to="/browse"
                variant="subtle"
                color="brand"
                rightSection={<IconArrowRight size={16} />}
              >
                Browse everything
              </Button>
            }
          />
          {universitiesQuery.isPending ? (
            <GridSkeleton count={3} />
          ) : (
            <EntityGrid
              kind="university"
              items={universities.map((university) => ({
                id: university.id,
                name: university.name,
                meta: 'Open the catalogue',
              }))}
              getLink={(item) => ({
                to: '/universities/$universityId',
                params: { universityId: item.id },
              })}
            />
          )}

          {departments.length > 0 && (
            <div className={styles.departmentSpotlight} id="departments">
              <div className={styles.departmentSpotlightHeader}>
                <div>
                  <Text className={styles.eyebrow}>Or jump straight in</Text>
                  <Title order={3} className={styles.departmentSpotlightTitle}>
                    Explore by department
                  </Title>
                </div>
                <Text size="xs" c="dimmed">
                  {departments.length} department{departments.length === 1 ? '' : 's'} in the
                  catalogue
                </Text>
              </div>
              <div className={styles.departmentList}>
                {departments.slice(0, 8).map((department, index) => (
                  <Link
                    key={department.id}
                    to="/departments/$departmentId"
                    params={{ departmentId: department.id }}
                    className={styles.departmentRow}
                  >
                    <span className={styles.departmentIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.departmentName}>{department.name}</span>
                    <span className={styles.departmentFaculty}>
                      {department.facultyName ?? 'Faculty'}
                    </span>
                    <IconArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className={styles.howSection} id="how-it-works">
        <Container size="xl">
          <div className={styles.howGrid}>
            <div className={styles.howCopy}>
              <Text className={styles.eyebrowLight}>A better study routine</Text>
              <Title order={2} className={styles.howTitle}>
                Less searching.
                <br />
                More learning.
              </Title>
              <Text className={styles.howLead}>
                DigitalNotes keeps the academic structure intact, so you never have to guess
                which document belongs to your course.
              </Text>
              <Button
                component={Link}
                to="/browse"
                variant="white"
                color="brand"
                radius="md"
                rightSection={<IconArrowRight size={16} />}
                mt="lg"
              >
                Find your next document
              </Button>
            </div>

            <div className={styles.howSteps}>
              {STEPS.map((step) => (
                <div key={step.number} className={styles.howStep}>
                  <span>{step.number}</span>
                  <div>
                    <Text fw={700} size="lg" className={styles.howStepTitle}>
                      {step.title}
                    </Text>
                    <Text size="sm" className={styles.howStepText}>
                      {step.text}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.closingCta}>
        <Container size="xl">
          <div className={styles.closingInner}>
            <div>
              <Text className={styles.eyebrow}>Your next study session</Text>
              <Title order={2} className={styles.closingTitle}>
                The right notes are closer than you think.
              </Title>
              <Text size="sm" c="dimmed" mt="sm" maw={520}>
                Search the library, follow your programme and open a document that was made for
                your course.
              </Text>
            </div>
            <Button
              component={Link}
              to="/browse"
              size="lg"
              radius="md"
              color="brand"
              rightSection={<IconArrowRight size={18} />}
            >
              Browse the library
            </Button>
          </div>
        </Container>
      </section>
    </main>
  )
}

function Stat({
  value,
  label,
  accent = false,
}: Readonly<{ value: string | number; label: string; accent?: boolean }>) {
  return (
    <div className={styles.statItem}>
      <span className={accent ? styles.statValueAccent : styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export default HomePage

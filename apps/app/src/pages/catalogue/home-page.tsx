import { Badge, Box, Button, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight, IconBook2, IconBuildingBank, IconSparkles } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { listUniversities } from '@/shared/api/endpoints'
import {
  EntityGrid,
  GridSkeleton,
  SearchField,
  SectionHeading,
} from './components'
import type { University } from './types'
import styles from './catalogue.module.scss'

const STEPS = [
  {
    icon: IconBuildingBank,
    title: 'Start with your university',
    text: 'Choose your institution, then drill down through your faculty and department.',
  },
  {
    icon: IconBook2,
    title: 'Find the right course',
    text: 'Filter by level and semester to land on the exact course you are studying.',
  },
  {
    icon: IconSparkles,
    title: 'Read approved material',
    text: 'Every note has been reviewed. Open the pages and study with confidence.',
  },
]

export function HomePage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const universitiesQuery = useQuery({
    queryKey: ['universities', debouncedSearch],
    queryFn: () =>
      listUniversities({
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        limit: 100,
      }),
    select: (payload) => normalizeCollectionResponse<University>(payload).data,
  })

  const universities = universitiesQuery.data ?? []

  const scrollToCatalogue = () => {
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className={styles.publicPage}>
      <section className={styles.hero}>
        <Box className={styles.heroOrbOne} aria-hidden />
        <Box className={styles.heroOrbTwo} aria-hidden />
        <Container size="lg" className={styles.heroInner}>
          <Badge className={styles.heroBadge} variant="white" color="brand" size="lg">
            DigitalNotes · Course material library
          </Badge>
          <Title className={styles.heroTitle}>
            Your course notes,
            <br />
            finally in one place.
          </Title>
          <Text className={styles.heroText}>
            Browse the academic catalogue, find the material for your exact course and study
            without chasing PDFs across chats and groups.
          </Text>
          <Group gap="sm" mt="xl">
            <Button
              size="md"
              radius="md"
              color="white"
              variant="white"
              rightSection={<IconArrowRight size={18} />}
              onClick={scrollToCatalogue}
            >
              Browse the catalogue
            </Button>
            <Text size="sm" className={styles.heroHint}>
              University → Course → Notes
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt={56} className={styles.heroSteps}>
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <Paper key={step.title} className={styles.heroStep} p="md" radius="lg">
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                    <Box className={styles.heroStepNumber}>0{index + 1}</Box>
                    <Box>
                      <Group gap={8} mb={4}>
                        <Icon size={17} stroke={1.7} />
                        <Text fw={600} size="sm">
                          {step.title}
                        </Text>
                      </Group>
                      <Text size="xs" className={styles.heroStepText}>
                        {step.text}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              )
            })}
          </SimpleGrid>
        </Container>
      </section>

      <Container size="lg" className={styles.homeContent} id="catalogue">
        <SectionHeading
          eyebrow="Start here"
          title="Choose your university"
          description="The catalogue is organised the same way your studies are."
          action={
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Search a university…"
            />
          }
        />

        {universitiesQuery.isLoading ? (
          <GridSkeleton />
        ) : (
          <>
            <EntityGrid
              kind="university"
              items={universities.map((university) => ({
                id: university.id,
                name: university.name,
              }))}
              getLink={(item) => ({
                to: '/universities/$universityId',
                params: { universityId: item.id },
              })}
            />
            {debouncedSearch && universities.length > 0 && (
              <Text size="xs" c="dimmed" mt="md">
                {universities.length} result{universities.length === 1 ? '' : 's'} for “
                {debouncedSearch}”
              </Text>
            )}
          </>
        )}
      </Container>

      <section className={styles.closingBand}>
        <Container size="lg">
          <Stack align="center" gap="xs" py={48}>
            <Text className={styles.eyebrow}>A calmer way to revise</Text>
            <Title order={2} ta="center" className={styles.closingTitle}>
              Find the material that matches your course.
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={480}>
              No noisy feeds. No guessing which file is relevant. Just the notes, organised
              around your programme.
            </Text>
          </Stack>
        </Container>
      </section>
    </main>
  )
}

export default HomePage

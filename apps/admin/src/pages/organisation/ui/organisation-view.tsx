import { Alert, Button, Group, Modal, Tabs } from '@mantine/core'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { organisationApi, type Department, type Faculty, type Level, type Semester, type University } from '@/entities/organisation'
import { DepartmentForm, FacultyForm, LevelForm, SemesterForm, UniversityForm } from '@/features/manage-organisation'
import { CollectionManager, type CollectionColumn } from '@/widgets/collection'
import { PageContainer } from '@/widgets/page-container'
import { queryKeys } from '@/shared/api/query-client'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Organisation' }]

type ModalKind = 'university' | 'faculty' | 'department' | 'level' | 'semester' | null

export function OrganisationView() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('universities')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalKind>(null)

  const universitiesQuery = useQuery({ queryKey: queryKeys.universities(search), queryFn: () => organisationApi.universities({ search }) })
  const facultiesQuery = useQuery({ queryKey: queryKeys.faculties(undefined, search), queryFn: () => organisationApi.faculties({ search }) })
  const departmentsQuery = useQuery({ queryKey: queryKeys.departments(undefined, search), queryFn: () => organisationApi.departments({ search }) })
  const levelsQuery = useQuery({ queryKey: queryKeys.levels(undefined, search), queryFn: () => organisationApi.levels({ search }) })
  const semestersQuery = useQuery({ queryKey: queryKeys.semesters(search), queryFn: () => organisationApi.semesters({ search }) })

  const universities = useMemo(() => universitiesQuery.data ?? [], [universitiesQuery.data])
  const faculties = useMemo(() => facultiesQuery.data ?? [], [facultiesQuery.data])
  const departments = useMemo(() => departmentsQuery.data ?? [], [departmentsQuery.data])
  const levels = useMemo(() => levelsQuery.data ?? [], [levelsQuery.data])
  const semesters = useMemo(() => semestersQuery.data ?? [], [semestersQuery.data])

  function handleCreated() {
    setModal(null)
    void queryClient.invalidateQueries({ queryKey: ['admin'] })
  }

  const universityOptions = universities.map((item) => ({ value: item.id, label: item.name }))
  const facultyOptions = faculties.map((item) => ({ value: item.id, label: item.name }))
  const departmentOptions = departments.map((item) => ({ value: item.id, label: item.name }))

  const universityColumns: Array<CollectionColumn<University>> = [
    { key: 'name', title: 'Name', render: (row) => row.name },
    { key: 'slug', title: 'Slug', render: (row) => row.slug },
  ]
  const facultyColumns: Array<CollectionColumn<Faculty>> = [
    { key: 'name', title: 'Name', render: (row) => row.name },
    { key: 'slug', title: 'Slug', render: (row) => row.slug },
    { key: 'universityId', title: 'University', render: (row) => universities.find((item) => item.id === row.universityId)?.name ?? row.universityId },
  ]
  const departmentColumns: Array<CollectionColumn<Department>> = [
    { key: 'name', title: 'Name', render: (row) => row.name },
    { key: 'slug', title: 'Slug', render: (row) => row.slug },
    { key: 'facultyId', title: 'Faculty', render: (row) => faculties.find((item) => item.id === row.facultyId)?.name ?? row.facultyId },
  ]
  const levelColumns: Array<CollectionColumn<Level>> = [
    { key: 'name', title: 'Name', render: (row) => row.name },
    { key: 'departmentId', title: 'Department', render: (row) => departments.find((item) => item.id === row.departmentId)?.name ?? row.departmentId },
  ]
  const semesterColumns: Array<CollectionColumn<Semester>> = [
    { key: 'name', title: 'Name', render: (row) => row.name },
  ]

  const failed = universitiesQuery.isError || facultiesQuery.isError || departmentsQuery.isError || levelsQuery.isError || semestersQuery.isError

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      actions={(
        <Group gap="xs">
          <Button size="xs" variant={tab === 'universities' ? 'filled' : 'light'} onClick={() => { setTab('universities'); setModal('university') }}>New university</Button>
          <Button size="xs" variant="light" onClick={() => setModal('faculty')}>New faculty</Button>
          <Button size="xs" variant="light" onClick={() => setModal('department')}>New department</Button>
          <Button size="xs" variant="light" onClick={() => setModal('level')}>New level</Button>
          <Button size="xs" variant="light" onClick={() => setModal('semester')}>New semester</Button>
        </Group>
      )}
    >
      {failed && <Alert color="yellow">Backend is unreachable — showing empty lists. Check API_URL and admin session.</Alert>}
      <Tabs value={tab} onChange={(value) => setTab(value ?? 'universities')}>
        <Tabs.List>
          <Tabs.Tab value="universities">Universities ({universities.length})</Tabs.Tab>
          <Tabs.Tab value="faculties">Faculties ({faculties.length})</Tabs.Tab>
          <Tabs.Tab value="departments">Departments ({departments.length})</Tabs.Tab>
          <Tabs.Tab value="levels">Levels ({levels.length})</Tabs.Tab>
          <Tabs.Tab value="semesters">Semesters ({semesters.length})</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="universities" pt="md">
          <CollectionManager rows={universities} columns={universityColumns} search={search} onSearchChange={setSearch} searchPlaceholder="Search organisation" summary={`${universities.length} universities`} emptyLabel="No universities yet." />
        </Tabs.Panel>
        <Tabs.Panel value="faculties" pt="md">
          <CollectionManager rows={faculties} columns={facultyColumns} search={search} onSearchChange={setSearch} searchPlaceholder="Search organisation" summary={`${faculties.length} faculties`} emptyLabel="No faculties yet." />
        </Tabs.Panel>
        <Tabs.Panel value="departments" pt="md">
          <CollectionManager rows={departments} columns={departmentColumns} search={search} onSearchChange={setSearch} searchPlaceholder="Search organisation" summary={`${departments.length} departments`} emptyLabel="No departments yet." />
        </Tabs.Panel>
        <Tabs.Panel value="levels" pt="md">
          <CollectionManager rows={levels} columns={levelColumns} search={search} onSearchChange={setSearch} searchPlaceholder="Search organisation" summary={`${levels.length} levels`} emptyLabel="No levels yet." />
        </Tabs.Panel>
        <Tabs.Panel value="semesters" pt="md">
          <CollectionManager rows={semesters} columns={semesterColumns} search={search} onSearchChange={setSearch} searchPlaceholder="Search organisation" summary={`${semesters.length} semesters`} emptyLabel="No semesters yet." />
        </Tabs.Panel>
      </Tabs>

      <Modal opened={modal !== null} onClose={() => setModal(null)} title="Create record" centered>
        {modal === 'university' && <UniversityForm onSuccess={handleCreated} />}
        {modal === 'faculty' && <FacultyForm universities={universityOptions} onSuccess={handleCreated} />}
        {modal === 'department' && <DepartmentForm faculties={facultyOptions} onSuccess={handleCreated} />}
        {modal === 'level' && <LevelForm departments={departmentOptions} onSuccess={handleCreated} />}
        {modal === 'semester' && <SemesterForm onSuccess={handleCreated} />}
      </Modal>
    </PageContainer>
  )
}

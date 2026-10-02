import { Alert, Button, Group, Modal, Tabs } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { unwrapCollection } from '@digitalnotes/core'
import {
  listDepartments,
  listFaculties,
  listLevels,
  listSemesters,
  listUniversities,
} from '@/shared/api/endpoints'
import { CollectionTable, PageContainer, type TableColumn } from '@digitalnotes/core'
import { queryClient, queryKeys } from '@/shared/api/query-client'
import { UniversityForm } from './forms/university-form'
import { FacultyForm } from './forms/faculty-form'
import { DepartmentForm } from './forms/department-form'
import { LevelForm } from './forms/level-form'
import { SemesterForm } from './forms/semester-form'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Organisation' }]

type ModalKind = 'university' | 'faculty' | 'department' | 'level' | 'semester' | null

export function OrganisationView() {
  const [tab, setTab] = useState('universities')
  const [modal, setModal] = useState<ModalKind>(null)

  function handleCreated() {
    setModal(null)
    void queryClient.invalidateQueries({ queryKey: ['admin'] })
  }


  const universityColumns: TableColumn[] = [
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
    { accessor: 'slug', title: 'Slug', render: (row: any) => row.slug ?? row.name },
  ]
  const facultyColumns: TableColumn[] = [
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
    { accessor: 'slug', title: 'Slug', render: (row: any) => row.slug ?? row.name },
    {
      accessor: 'universityId',
      title: 'University',
    },
  ]
  const departmentColumns: TableColumn[] = [
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
    { accessor: 'slug', title: 'Slug', render: (row: any) => row.slug ?? row.name },
    {
      accessor: 'facultyId',
      title: 'Faculty',
    },
  ]
  const levelColumns: TableColumn[] = [
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
    {
      accessor: 'departmentId',
      title: 'Department',
    },
  ]
  const semesterColumns: TableColumn[] = [
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
  ]


  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Organisation"
      description="Manage universities, faculties and departments"
      icon={<IconBuilding size={20} />}
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
      <Tabs value={tab} onChange={(value) => setTab(value ?? 'universities')}>
        <Tabs.List>
          <Tabs.Tab value="universities">Universities</Tabs.Tab>
          <Tabs.Tab value="faculties">Faculties</Tabs.Tab>
          <Tabs.Tab value="departments">Departments</Tabs.Tab>
          <Tabs.Tab value="levels">Levels</Tabs.Tab>
          <Tabs.Tab value="semesters">Semesters</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="universities" pt="md">
          <CollectionTable
            columns={universityColumns}
            fetchApi={listUniversities}
            cacheKey="admin-universities"
            limit={20}
          />
        </Tabs.Panel>
        <Tabs.Panel value="faculties" pt="md">
          <CollectionTable
            columns={facultyColumns}
            fetchApi={listFaculties}
            cacheKey="admin-faculties"
            limit={20}
          />
        </Tabs.Panel>
        <Tabs.Panel value="departments" pt="md">
          <CollectionTable
            columns={departmentColumns}
            fetchApi={listDepartments}
            cacheKey="admin-departments"
            limit={20}
          />
        </Tabs.Panel>
        <Tabs.Panel value="levels" pt="md">
          <CollectionTable
            columns={levelColumns}
            fetchApi={listLevels}
            cacheKey="admin-levels"
            limit={20}
          />
        </Tabs.Panel>
        <Tabs.Panel value="semesters" pt="md">
          <CollectionTable
            columns={semesterColumns}
            fetchApi={listSemesters}
            cacheKey="admin-semesters"
            limit={20}
          />
        </Tabs.Panel>
      </Tabs>

      <Modal opened={modal !== null} onClose={() => setModal(null)} title="Create record" centered>
        {modal === 'university' && <UniversityForm onSuccess={handleCreated} />}
        {modal === 'faculty' && <FacultyForm  onSuccess={handleCreated} />}
        {modal === 'department' && <DepartmentForm  onSuccess={handleCreated} />}
        {modal === 'level' && <LevelForm  onSuccess={handleCreated} />}
        {modal === 'semester' && <SemesterForm onSuccess={handleCreated} />}
      </Modal>
    </PageContainer>
  )
}

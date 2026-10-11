import { Modal } from '@mantine/core'
import { IconBuilding, IconPlus } from '@tabler/icons-react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import {
  listDepartments,
  listFaculties,
  listLevels,
  listSemesters,
  listUniversities,
} from '@/shared/api/endpoints'
import { CollectionTable, PageContainer, type PageTab, type TableColumn } from '@digitalnotes/core'
import { queryClient } from '@/shared/api/query-client'
import { UniversityForm } from './forms/university-form'
import { FacultyForm } from './forms/faculty-form'
import { DepartmentForm } from './forms/department-form'
import { LevelForm } from './forms/level-form'
import { SemesterForm } from './forms/semester-form'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Organisation' }]

const organisationRoute = getRouteApi('/_app/organisation')

const tabs: PageTab[] = [
  { value: 'universities', label: 'Universities' },
  { value: 'faculties', label: 'Faculties' },
  { value: 'departments', label: 'Departments' },
  { value: 'levels', label: 'Levels' },
  { value: 'semesters', label: 'Semesters' },
]

const DEFAULT_TAB = 'universities'

type ModalKind = 'university' | 'faculty' | 'department' | 'level' | 'semester' | null

export function OrganisationView() {
  const search = organisationRoute.useSearch()
  const navigate = organisationRoute.useNavigate()
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

  const tab = tabs.some((item) => item.value === search.tab) ? (search.tab as string) : DEFAULT_TAB

  function handleTabChange(value: string | null) {
    void navigate({ search: { tab: value ?? undefined } })
  }

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Organisation"
      description="Manage universities, faculties and departments"
      icon={<IconBuilding size={20} />}
      tabs={tabs}
      tabValue={tab}
      onTabChange={handleTabChange}
      actions={[
        { key: 'new-university', label: 'New university', icon: <IconPlus size={16} />, size: 'xs', tabValue: 'universities', onClick: () => { handleTabChange('universities'); setModal('university') } },
        { key: 'new-faculty', label: 'New faculty', icon: <IconPlus size={16} />, size: 'xs', tabValue: 'faculties', onClick: () => setModal('faculty') },
        { key: 'new-department', label: 'New department', icon: <IconPlus size={16} />, size: 'xs', tabValue: 'departments', onClick: () => setModal('department') },
        { key: 'new-level', label: 'New level', icon: <IconPlus size={16} />, size: 'xs', tabValue: 'levels', onClick: () => setModal('level') },
        { key: 'new-semester', label: 'New semester', icon: <IconPlus size={16} />, size: 'xs', tabValue: 'semesters', onClick: () => setModal('semester') },
      ]}
    >
      <CollectionTable
        columns={universityColumns}
        fetchApi={listUniversities}
        cacheKey="admin-universities"
        limit={20}
      />
      <CollectionTable
        columns={facultyColumns}
        fetchApi={listFaculties}
        cacheKey="admin-faculties"
        limit={20}
      />
      <CollectionTable
        columns={departmentColumns}
        fetchApi={listDepartments}
        cacheKey="admin-departments"
        limit={20}
      />
      <CollectionTable
        columns={levelColumns}
        fetchApi={listLevels}
        cacheKey="admin-levels"
        limit={20}
      />
      <CollectionTable
        columns={semesterColumns}
        fetchApi={listSemesters}
        cacheKey="admin-semesters"
        limit={20}
      />

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

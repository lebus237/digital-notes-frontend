import {
  Alert,
  Button,
  Group,
  Paper,
  Select,
  Skeleton,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconCheck, IconDeviceFloppy, IconSchool } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  getStudentProfile,
  listDepartments,
  listFaculties,
  listLevels,
  listSemesters,
  listUniversities,
  updateStudentProfile,
} from '@/shared/api/endpoints'
import { useSession } from '@/shared/auth/use-session'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
} from '@/pages/catalogue/components'
import type { Department, Faculty, Level, Semester, University } from '@/pages/catalogue/types'
import { AccountPageLoader, AccountSidebar, SignInPrompt } from './components'
import type { AcademicForm, StudentProfile } from './types'
import styles from './account.module.scss'

const EMPTY_FORM: AcademicForm = {
  universityId: null,
  facultyId: null,
  departmentId: null,
  levelId: null,
  semesterId: null,
}

export function ProfilePage() {
  const navigate = useNavigate()
  const session = useSession()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<AcademicForm>(EMPTY_FORM)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session.ready && !session.authenticated) {
      void navigate({ to: '/login', search: { redirect: '/profile' } as never })
    }
  }, [navigate, session.authenticated, session.ready])

  const profileQuery = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => getStudentProfile(),
    select: (payload) => payload?.data as StudentProfile,
    enabled: session.authenticated,
  })

  const profile = profileQuery.data

  useEffect(() => {
    if (!profile) return
    setForm({
      universityId: profile.universityId,
      facultyId: profile.facultyId,
      departmentId: profile.departmentId,
      levelId: profile.levelId,
      semesterId: profile.semesterId,
    })
  }, [profile])

  const universitiesQuery = useQuery({
    queryKey: ['profile-universities'],
    queryFn: () => listUniversities({ limit: 100 }),
    select: (payload) => normalizeCollectionResponse<University>(payload).data,
    enabled: session.authenticated,
  })

  const facultiesQuery = useQuery({
    queryKey: ['profile-faculties', form.universityId],
    queryFn: () =>
      listFaculties({ universityId: form.universityId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Faculty>(payload).data
      ),
    enabled: Boolean(form.universityId),
  })

  const departmentsQuery = useQuery({
    queryKey: ['profile-departments', form.facultyId],
    queryFn: () =>
      listDepartments({ facultyId: form.facultyId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Department>(payload).data
      ),
    enabled: Boolean(form.facultyId),
  })

  const levelsQuery = useQuery({
    queryKey: ['profile-levels', form.departmentId],
    queryFn: () =>
      listLevels({ departmentId: form.departmentId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Level>(payload).data
      ),
    enabled: Boolean(form.departmentId),
  })

  const semestersQuery = useQuery({
    queryKey: ['profile-semesters', form.departmentId],
    queryFn: () =>
      listSemesters({ departmentId: form.departmentId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Semester>(payload).data
      ),
    enabled: Boolean(form.departmentId),
  })

  const saveMutation = useMutation({
    mutationFn: () => updateStudentProfile(form),
    onSuccess: (payload) => {
      queryClient.setQueryData(['student-profile'], payload)
      setSaved(true)
      setError('')
    },
    onError: () => {
      setSaved(false)
      setError('Your profile could not be saved. Check the selections and try again.')
    },
  })

  const update = (key: keyof AcademicForm, value: string | null) => {
    setSaved(false)
    setError('')
    setForm((current) => {
      const next = { ...current, [key]: value }
      if (key === 'universityId') {
        next.facultyId = null
        next.departmentId = null
        next.levelId = null
        next.semesterId = null
      }
      if (key === 'facultyId') {
        next.departmentId = null
        next.levelId = null
        next.semesterId = null
      }
      if (key === 'departmentId') {
        next.levelId = null
        next.semesterId = null
      }
      return next
    })
  }

  if (!session.ready) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Your profile">
        <AccountPageLoader />
      </CataloguePage>
    )
  }

  if (!session.authenticated) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Your profile">
        <SignInPrompt />
      </CataloguePage>
    )
  }

  return (
    <CataloguePage
      eyebrow="Account"
      breadcrumbs={[BREADCRUMB_HOME, { label: 'Profile' }]}
      title="Your student profile"
      description="Tell DigitalNotes where you study and which semester you are in. The catalogue will follow your programme."
      actions={<BackLink to="/library" label="My library" />}
    >
      <div className={styles.accountLayout}>
        <AccountSidebar profile={profile} active="profile" />

        <div className={styles.accountMain}>
          {!profile && <Skeleton height={320} radius="lg" />}

          {profile && (
            <>
              {!profile.departmentId && (
                <Alert
                  color="brand"
                  variant="light"
                  icon={<IconSchool size={18} />}
                  className={styles.setupAlert}
                >
                  <Text fw={600} size="sm">
                    Finish setting up your programme
                  </Text>
                  <Text size="sm" mt={2}>
                    Choose your university, faculty, department, level and semester to get a
                    personalised library.
                  </Text>
                </Alert>
              )}

              <Paper className={styles.formCard} withBorder radius="lg">
                <div className={styles.cardHeader}>
                  <div>
                    <Text className={styles.cardEyebrow}>Academic profile</Text>
                    <Title order={2} className={styles.cardTitle}>
                      Where are you studying?
                    </Title>
                  </div>
                  <Group gap={6} className={styles.identityHint}>
                    <IconSchool size={15} />
                    <Text size="xs" c="dimmed">
                      Used to organise your library
                    </Text>
                  </Group>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="lg">
                  <Select
                    label="University"
                    placeholder="Choose your university"
                    data={(universitiesQuery.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={form.universityId}
                    onChange={(value) => update('universityId', value)}
                    searchable
                    clearable
                  />
                  <Select
                    label="Faculty"
                    placeholder={form.universityId ? 'Choose your faculty' : 'Choose a university first'}
                    data={(facultiesQuery.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={form.facultyId}
                    onChange={(value) => update('facultyId', value)}
                    disabled={!form.universityId}
                    searchable
                    clearable
                  />
                  <Select
                    label="Department"
                    placeholder={form.facultyId ? 'Choose your department' : 'Choose a faculty first'}
                    data={(departmentsQuery.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={form.departmentId}
                    onChange={(value) => update('departmentId', value)}
                    disabled={!form.facultyId}
                    searchable
                    clearable
                  />
                  <Select
                    label="Level"
                    placeholder={form.departmentId ? 'Choose your level' : 'Choose a department first'}
                    data={(levelsQuery.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={form.levelId}
                    onChange={(value) => update('levelId', value)}
                    disabled={!form.departmentId}
                    searchable
                    clearable
                  />
                  <Select
                    label="Semester"
                    placeholder={
                      form.departmentId ? 'Choose your semester' : 'Choose a department first'
                    }
                    data={(semestersQuery.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={form.semesterId}
                    onChange={(value) => update('semesterId', value)}
                    disabled={!form.departmentId}
                    searchable
                    clearable
                  />
                </SimpleGrid>

                {error && (
                  <Alert color="red" mt="lg">
                    {error}
                  </Alert>
                )}
                {saved && (
                  <Alert color="green" mt="lg" icon={<IconCheck size={16} />}>
                    Profile saved. Your library is now organised around your programme.
                  </Alert>
                )}

                <Group justify="space-between" align="center" mt="xl">
                  <Text size="xs" c="dimmed" maw={420}>
                    You can change these details at any time. Your saved documents stay in your
                    library.
                  </Text>
                  <Button
                    color="brand"
                    leftSection={<IconDeviceFloppy size={17} />}
                    loading={saveMutation.isPending}
                    onClick={() => saveMutation.mutate()}
                  >
                    Save profile
                  </Button>
                </Group>
              </Paper>

              <Paper className={styles.infoCard} withBorder radius="lg">
                <Text className={styles.cardEyebrow}>Account details</Text>
                <Stack gap={10} mt="sm">
                  <AccountRow label="Name" value={profile.fullName ?? 'Not provided'} />
                  <AccountRow label="Email" value={profile.email} />
                  <AccountRow label="Phone" value={profile.phoneNumber} />
                  <AccountRow
                    label="Programme"
                    value={
                      [profile.departmentName, profile.levelName, profile.semesterName]
                        .filter(Boolean)
                        .join(' · ') || 'Not set yet'
                    }
                  />
                </Stack>
              </Paper>
            </>
          )}
        </div>
      </div>
    </CataloguePage>
  )
}

function AccountRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Group justify="space-between" gap="lg" wrap="nowrap">
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500} ta="right">
        {value}
      </Text>
    </Group>
  )
}

export default ProfilePage

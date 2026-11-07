import {
  Alert,
  Button,
  Group,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  changePassword,
  getStudentProfile,
  listDepartments,
  listFaculties,
  listLevels,
  listSemesters,
  listUniversities,
  logoutStudent,
  updateStudentProfile,
} from '@/shared/api/endpoints'
import { useSession } from '@/shared/auth/use-session'
import { getInitials, academicLabel, type StudentProfile } from '@/shared/api/types'
import styleup from './profile-page.module.scss'

const PUBLIC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_PUBLIC_URL ?? 'http://localhost:3000'

type ProfileForm = {
  universityId: string | null
  facultyId: string | null
  departmentId: string | null
  levelId: string | null
  semesterId: string | null
}

const EMPTY_FORM: ProfileForm = {
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
  const [form, setForm] = useState(EMPTY_FORM)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmation: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

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
    select: (payload) => normalizeCollectionResponse<{ id: string; name: string }>(payload).data,
    enabled: session.authenticated,
  })
  const facultiesQuery = useQuery({
    queryKey: ['profile-faculties', form.universityId],
    queryFn: () =>
      listFaculties({ universityId: form.universityId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<{ id: string; name: string }>(payload).data
      ),
    enabled: Boolean(form.universityId),
  })
  const departmentsQuery = useQuery({
    queryKey: ['profile-departments', form.facultyId],
    queryFn: () =>
      listDepartments({ facultyId: form.facultyId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<{ id: string; name: string }>(payload).data
      ),
    enabled: Boolean(form.facultyId),
  })
  const levelsQuery = useQuery({
    queryKey: ['profile-levels', form.departmentId],
    queryFn: () =>
      listLevels({ departmentId: form.departmentId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<{ id: string; name: string }>(payload).data
      ),
    enabled: Boolean(form.departmentId),
  })
  const semestersQuery = useQuery({
    queryKey: ['profile-semesters', form.departmentId],
    queryFn: () =>
      listSemesters({ departmentId: form.departmentId as string, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<{ id: string; name: string }>(payload).data
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
      setError('Your profile could not be saved.')
    },
  })

  const update = (key: keyof typeof EMPTY_FORM, value: string | null) => {
    setSaved(false)
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

  const changePasswordSubmit = async () => {
    setPasswordError('')
    if (!passwords.currentPassword) return setPasswordError('Enter your current password.')
    if (passwords.newPassword !== passwords.confirmation)
      return setPasswordError('Passwords do not match.')
    if (
      passwords.newPassword.length < 6 ||
      !/[a-z]/.test(passwords.newPassword) ||
      !/[A-Z]/.test(passwords.newPassword) ||
      !/\d/.test(passwords.newPassword)
    ) {
      return setPasswordError('Use at least 6 characters with an uppercase, a lowercase and a number.')
    }
    setChangingPassword(true)
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      await logoutStudent()
      void navigate({ to: '/login', search: { notice: 'password-changed' } as never })
    } catch (submitError) {
      setPasswordError(submitError instanceof Error ? submitError.message : 'Password change failed.')
    } finally {
      setChangingPassword(false)
    }
  }

  if (!session.ready) {
    return (
      <Paper className={styleup.card} radius="lg">
        <Text c="dimmed">Preparing your profile…</Text>
      </Paper>
    )
  }

  if (!session.authenticated) {
    return (
      <Paper className={styleup.card} radius="lg">
        <Text size="lg" fw={700}>
          Sign in first
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Your academic profile and password settings live here.
        </Text>
        <Button component={Link} to="/login" color="brand" mt="lg">
          Sign in
        </Button>
      </Paper>
    )
  }

  return (
    <>
      <Paper className={styleup.card} radius="lg">
        <Group align="center" gap="sm" wrap="nowrap">
          <ThemeIcon size={48} radius="xl" color="brand" variant="light">
            <Text fw={700} size="md">
              {getInitials(profile?.fullName || profile?.email || 'Student')}
            </Text>
          </ThemeIcon>
          <Stack gap={2} className={styleup.identity}>
            <Text fw={700} lineClamp={1}>
              {profile?.fullName || profile?.email || 'Student'}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {profile?.email}
            </Text>
          </Stack>
        </Group>
        <Text className={styleup.programmeLabel} mt="md">
          {academicLabel(profile)}
        </Text>
      </Paper>

      <Paper className={styleup.card} radius="lg">
        <Title order={3} className={styleup.cardTitle}>
          Academic profile
        </Title>
        <Stack gap="md" mt="md">
          <Select
            label="University"
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
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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
              placeholder={form.departmentId ? 'Choose your semester' : 'Choose a department first'}
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
        </Stack>

        {error && (
          <Alert color="red" mt="md">
            {error}
          </Alert>
        )}
        {saved && (
          <Alert color="green" mt="md">
            Profile saved.
          </Alert>
        )}
        <Button
          color="brand"
          mt="lg"
          fullWidth
          loading={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          Save profile
        </Button>
      </Paper>

      <Paper className={styleup.card} radius="lg">
        <Title order={3} className={styleup.cardTitle}>
          Security
        </Title>
        <Text size="xs" c="dimmed" mt={4} lh={1.5}>
          Changing your password signs you out everywhere.
        </Text>
        <Stack gap="md" mt="md">
          <PasswordInput
            label="Current password"
            value={passwords.currentPassword}
            onChange={(event) =>
              setPasswords((current) => ({
                ...current,
                currentPassword: event.currentTarget.value,
              }))
            }
            autoComplete="current-password"
          />
          <PasswordInput
            label="New password"
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords((current) => ({ ...current, newPassword: event.currentTarget.value }))
            }
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm new password"
            value={passwords.confirmation}
            onChange={(event) =>
              setPasswords((current) => ({
                ...current,
                confirmation: event.currentTarget.value,
              }))
            }
            autoComplete="new-password"
          />
        </Stack>
        {passwordError && (
          <Alert color="red" mt="md">
            {passwordError}
          </Alert>
        )}
        <Button
          variant="light"
          color="brand"
          mt="lg"
          fullWidth
          loading={changingPassword}
          onClick={changePasswordSubmit}
        >
          Update password
        </Button>
      </Paper>

      <Paper className={styleup.card} radius="lg">
        <Title order={3} className={styleup.cardTitle}>
          Catalogue
        </Title>
        <Text size="xs" c="dimmed" mt={4}>
          Browse the full public library on your phone or computer.
        </Text>
        <a href={PUBLIC_URL} className={styleup.exploreLink}>
          Open the catalogue
        </a>
      </Paper>
    </>
  )
}

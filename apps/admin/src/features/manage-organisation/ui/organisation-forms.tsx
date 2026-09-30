import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import {
  departmentSchema,
  facultySchema,
  levelSchema,
  organisationApi,
  semesterSchema,
  universitySchema,
  type DepartmentValues,
  type FacultyValues,
  type LevelValues,
  type SemesterValues,
  type UniversityValues,
} from '@/entities/organisation'

type Option = { value: string; label: string }

function useSubmit<T>(fn: (value: T) => Promise<unknown>, onSuccess?: () => void) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(value: T) {
    setError('')
    setPending(true)
    try {
      await fn(value)
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return { error, pending, handleSubmit }
}

const universityOpts = formOptions({
  defaultValues: { name: '', slug: '' } satisfies UniversityValues,
  validators: { onSubmit: universitySchema },
})

export function UniversityForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const { error, pending, handleSubmit } = useSubmit(
    (value: UniversityValues) => organisationApi.createUniversity(value),
    onSuccess,
  )
  return (
    <FormWrapper formOptions={universityOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.TextInput name="name" label="University name" placeholder="e.g. University of Lagos" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. university-of-lagos" withAsterisk />
        <Button type="submit" loading={pending}>Create university</Button>
      </Stack>
    </FormWrapper>
  )
}

const facultyOpts = formOptions({
  defaultValues: { universityId: '', name: '', slug: '' } satisfies FacultyValues,
  validators: { onSubmit: facultySchema },
})

export function FacultyForm({ universities, onSuccess }: Readonly<{ universities: Option[]; onSuccess?: () => void }>) {
  const { error, pending, handleSubmit } = useSubmit(
    (value: FacultyValues) => organisationApi.createFaculty(value),
    onSuccess,
  )
  return (
    <FormWrapper formOptions={facultyOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select name="universityId" label="University" placeholder="Select university" data={universities} withAsterisk />
        <FormField.TextInput name="name" label="Faculty name" placeholder="e.g. Faculty of Science" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. faculty-of-science" withAsterisk />
        <Button type="submit" loading={pending}>Create faculty</Button>
      </Stack>
    </FormWrapper>
  )
}

const departmentOpts = formOptions({
  defaultValues: { facultyId: '', name: '', slug: '' } satisfies DepartmentValues,
  validators: { onSubmit: departmentSchema },
})

export function DepartmentForm({ faculties, onSuccess }: Readonly<{ faculties: Option[]; onSuccess?: () => void }>) {
  const { error, pending, handleSubmit } = useSubmit(
    (value: DepartmentValues) => organisationApi.createDepartment(value),
    onSuccess,
  )
  return (
    <FormWrapper formOptions={departmentOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select name="facultyId" label="Faculty" placeholder="Select faculty" data={faculties} withAsterisk />
        <FormField.TextInput name="name" label="Department name" placeholder="e.g. Computer Science" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. computer-science" withAsterisk />
        <Button type="submit" loading={pending}>Create department</Button>
      </Stack>
    </FormWrapper>
  )
}

const levelOpts = formOptions({
  defaultValues: { departmentId: '', name: '' } satisfies LevelValues,
  validators: { onSubmit: levelSchema },
})

export function LevelForm({ departments, onSuccess }: Readonly<{ departments: Option[]; onSuccess?: () => void }>) {
  const { error, pending, handleSubmit } = useSubmit(
    (value: LevelValues) => organisationApi.createLevel(value),
    onSuccess,
  )
  return (
    <FormWrapper formOptions={levelOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select name="departmentId" label="Department" placeholder="Select department" data={departments} withAsterisk />
        <FormField.TextInput name="name" label="Level name" placeholder="e.g. 100 Level" withAsterisk />
        <Button type="submit" loading={pending}>Create level</Button>
      </Stack>
    </FormWrapper>
  )
}

const semesterOpts = formOptions({
  defaultValues: { name: '' } satisfies SemesterValues,
  validators: { onSubmit: semesterSchema },
})

export function SemesterForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const { error, pending, handleSubmit } = useSubmit(
    (value: SemesterValues) => organisationApi.createSemester(value),
    onSuccess,
  )
  return (
    <FormWrapper formOptions={semesterOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.TextInput name="name" label="Semester name" placeholder="e.g. First Semester" withAsterisk />
        <Button type="submit" loading={pending}>Create semester</Button>
      </Stack>
    </FormWrapper>
  )
}

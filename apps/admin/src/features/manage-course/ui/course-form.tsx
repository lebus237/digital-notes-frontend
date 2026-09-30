import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { courseSchema, type CourseValues } from '@/entities/course'
import { createCourse } from '@/shared/api/endpoints/courses'

type Option = { value: string; label: string }

type CourseFormProps = {
  departments: Option[]
  levels: Option[]
  semesters: Option[]
  onSuccess?: () => void
}

const courseOpts = formOptions({
  defaultValues: {
    departmentId: '',
    levelId: '',
    semesterId: '',
    code: '',
    name: '',
    description: '',
    lecturerName: '',
  } satisfies CourseValues,
  validators: { onSubmit: courseSchema },
})

export function CourseForm({ departments, levels, semesters, onSuccess }: Readonly<CourseFormProps>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(value: CourseValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createCourse(value)) as unknown
      if (
        result !== null &&
        typeof result === 'object' &&
        'status' in result &&
        (result as { status?: string }).status === 'error'
      ) {
        throw new Error((result as { error?: { message?: string } }).error?.message ?? 'Could not create course.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not create course.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={courseOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select name="departmentId" label="Department" placeholder="Select department" data={departments} withAsterisk />
        <FormField.Select name="levelId" label="Level" placeholder="Select level" data={levels} withAsterisk />
        <FormField.Select name="semesterId" label="Semester" placeholder="Select semester" data={semesters} withAsterisk />
        <FormField.TextInput name="code" label="Course code" placeholder="e.g. CSC 101" withAsterisk />
        <FormField.TextInput name="name" label="Course name" placeholder="e.g. Introduction to Computing" withAsterisk />
        <FormField.TextArea name="description" label="Description" placeholder="Optional course description" minRows={2} />
        <FormField.TextInput name="lecturerName" label="Lecturer" placeholder="Optional lecturer name" />
        <Button type="submit" loading={pending}>Create course</Button>
      </Stack>
    </FormWrapper>
  )
}

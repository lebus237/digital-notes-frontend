import { unwrapCollection } from '@digitalnotes/core'
import { archiveCourse, createCourse, getCourse, listCourses, updateCourse } from '@/shared/api/endpoints'
import type { CourseValues, UpdateCourseValues } from './schemas'
import type { Course, CourseFilters } from './types'

function throwIfError(result: unknown, fallback: string): void {
  if (result !== null && typeof result === 'object' && 'status' in result && (result as { status?: string }).status === 'error') {
    throw new Error((result as { error?: { message?: string } }).error?.message ?? fallback)
  }
}

function clean<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== '' && item !== undefined)) as Partial<T>
}

export const courseApi = {
  async list(filters?: CourseFilters): Promise<Course[]> {
    const result = await listCourses({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
      departmentId: filters?.departmentId,
      levelId: filters?.levelId,
      semesterId: filters?.semesterId,
    })
    throwIfError(result, 'Could not load courses.')
    return unwrapCollection<Course>(result)
  },
  async detail(id: string): Promise<Course> {
    const result = (await getCourse(id)) as unknown
    throwIfError(result, 'Could not load course.')
    if (result !== null && typeof result === 'object' && 'data' in result) {
      return (result as { data: Course }).data
    }
    return result as Course
  },
  async create(payload: CourseValues): Promise<{ id: string }> {
    const body = {
      ...clean(payload as unknown as Record<string, unknown>),
      description: payload.description === '' ? null : (payload.description ?? null),
      lecturerName: payload.lecturerName === '' ? null : (payload.lecturerName ?? null),
    }
    const result = (await createCourse(body)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create course.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create course.')
    return { id: result.id }
  },
  async update(id: string, payload: UpdateCourseValues): Promise<void> {
    const result = await updateCourse(id, clean(payload as unknown as Record<string, unknown>))
    throwIfError(result, 'Could not update course.')
  },
  async archive(id: string): Promise<void> {
    const result = await archiveCourse(id, {})
    throwIfError(result, 'Could not archive course.')
  },
}

import { unwrapCollection } from '@digitalnotes/core'
import {
  createDepartment,
  createFaculty,
  createLevel,
  createSemester,
  createUniversity,
  listDepartments,
  listFaculties,
  listLevels,
  listSemesters,
  listUniversities,
} from '@/shared/api/endpoints'
import type { DepartmentValues, FacultyValues, LevelValues, SemesterValues, UniversityValues } from './schemas'
import type { Department, Faculty, Level, ListQuery, Semester, University } from './types'

function throwIfError(result: unknown, fallback: string): void {
  if (result !== null && typeof result === 'object' && 'status' in result && (result as { status?: string }).status === 'error') {
    const error = (result as { error?: { message?: string } }).error
    throw new Error(error?.message ?? fallback)
  }
}

async function list<T>(action: (params?: Record<string, string | number | undefined>) => Promise<unknown>, query?: ListQuery): Promise<T[]> {
  const result = await action({
    search: query?.search,
    page: query?.page,
    limit: query?.limit,
    universityId: query?.universityId,
    facultyId: query?.facultyId,
    departmentId: query?.departmentId,
  })
  throwIfError(result, 'Request failed. Try again.')
  return unwrapCollection<T>(result)
}

export const organisationApi = {
  universities: (query?: ListQuery) => list<University>(listUniversities, query),
  faculties: (query?: ListQuery) => list<Faculty>(listFaculties, query),
  departments: (query?: ListQuery) => list<Department>(listDepartments, query),
  levels: (query?: ListQuery) => list<Level>(listLevels, query),
  semesters: (query?: ListQuery) => list<Semester>(listSemesters, query),

  async createUniversity(payload: UniversityValues): Promise<{ id: string }> {
    const result = (await createUniversity(payload)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create university.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create university.')
    return { id: result.id }
  },
  async createFaculty(payload: FacultyValues): Promise<{ id: string }> {
    const result = (await createFaculty(payload)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create faculty.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create faculty.')
    return { id: result.id }
  },
  async createDepartment(payload: DepartmentValues): Promise<{ id: string }> {
    const result = (await createDepartment(payload)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create department.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create department.')
    return { id: result.id }
  },
  async createLevel(payload: LevelValues): Promise<{ id: string }> {
    const result = (await createLevel(payload)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create level.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create level.')
    return { id: result.id }
  },
  async createSemester(payload: SemesterValues): Promise<{ id: string }> {
    const result = (await createSemester(payload)) as { id?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create semester.')
    if (!result?.id) throw new Error(result?.error?.message ?? 'Could not create semester.')
    return { id: result.id }
  },
}

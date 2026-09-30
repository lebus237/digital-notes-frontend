import { unwrapCollection } from '@digitalnotes/core'
import { adminResetPassword } from '@/shared/api/endpoints/users'
import { createEmployee, getEmployee, listEmployees } from '@/shared/api/endpoints/employees'
import type { EmployeeValues } from './schemas'
import type { Employee, EmployeeFilters } from './types'

function throwIfError(result: unknown, fallback: string): void {
  if (result !== null && typeof result === 'object' && 'status' in result && (result as { status?: string }).status === 'error') {
    throw new Error((result as { error?: { message?: string } }).error?.message ?? fallback)
  }
}

export const employeeApi = {
  async list(filters?: EmployeeFilters): Promise<Employee[]> {
    const result = await listEmployees({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
      universityId: filters?.universityId,
    })
    throwIfError(result, 'Could not load employees.')
    return unwrapCollection<Employee>(result)
  },
  async detail(id: string): Promise<Employee> {
    const result = (await getEmployee(id)) as unknown
    throwIfError(result, 'Could not load employee.')
    if (result !== null && typeof result === 'object' && 'data' in result) {
      return (result as { data: Employee }).data
    }
    return result as Employee
  },
  async create(payload: EmployeeValues): Promise<{ id: string }> {
    const result = (await createEmployee(payload)) as { id?: string; userId?: string; status?: string; error?: { message?: string } }
    throwIfError(result, 'Could not create employee.')
    const id = result?.id ?? result?.userId
    if (!id) throw new Error(result?.error?.message ?? 'Could not create employee.')
    return { id }
  },
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const result = await adminResetPassword(userId, { newPassword })
    throwIfError(result, 'Could not reset password.')
  },
}

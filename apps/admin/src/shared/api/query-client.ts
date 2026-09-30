import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

export const queryKeys = {
  universities: (search?: string) => ['admin', 'universities', search ?? ''] as const,
  faculties: (universityId?: string, search?: string) => ['admin', 'faculties', universityId ?? '', search ?? ''] as const,
  departments: (facultyId?: string, search?: string) => ['admin', 'departments', facultyId ?? '', search ?? ''] as const,
  levels: (departmentId?: string, search?: string) => ['admin', 'levels', departmentId ?? '', search ?? ''] as const,
  semesters: (search?: string) => ['admin', 'semesters', search ?? ''] as const,
  courses: (filters?: Record<string, string | undefined>) =>
    ['admin', 'courses', filters?.departmentId ?? '', filters?.levelId ?? '', filters?.semesterId ?? '', filters?.search ?? ''] as const,
  employees: (universityId?: string, search?: string) => ['admin', 'employees', universityId ?? '', search ?? ''] as const,
  notes: (courseId?: string, search?: string) => ['admin', 'notes', courseId ?? '', search ?? ''] as const,
}

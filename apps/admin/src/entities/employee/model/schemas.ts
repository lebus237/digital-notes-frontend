import { z } from 'zod'

export const employeeSchema = z.object({
  universityId: z.string().min(1, 'Select a university.'),
  fullName: z.string().min(2, 'Use at least 2 characters.').max(255, 'Keep it under 255 characters.'),
  email: z.email('Enter a valid email address.'),
  phoneNumber: z.string().min(1, 'Enter a phone number.').max(12, 'Keep it under 12 characters.'),
  role: z.string().min(1, 'Select a role.'),
})

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(10, 'Use at least 10 characters.')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Include upper, lower case and a number.'),
})

export type EmployeeValues = z.infer<typeof employeeSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

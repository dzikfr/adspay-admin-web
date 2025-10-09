import { z } from 'zod'

export const createAdminSchema = z
  .object({
    username: z.string().min(1, 'Nama wajib'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password tidak sesuai',
    path: ['confirmPassword'],
  })

export const updateAdminSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export const resetPasswordAdminSchema = z
  .object({
    newPassword: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Password tidak sesuai',
    path: ['confirmPassword'],
  })

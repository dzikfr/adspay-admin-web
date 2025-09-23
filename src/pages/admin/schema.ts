import { z } from 'zod'

export const createAdminSchema = z.object({
  username: z.string().min(1, 'Nama wajib'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const updateAdminSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

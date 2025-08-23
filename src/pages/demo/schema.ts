// Schema digunakan untuk validasi form menggunakan Zod

import { z } from 'zod'

export const demoSchema = z.object({
  name: z.string().min(1, 'Nama wajib'),
  email: z.string().min(1, 'Email wajib').email({ message: 'Email tidak valid' }),
  role: z.string().min(1, 'Pilih role'),
  avatar: z.union([z.instanceof(File), z.null()]).optional(),
  startDate: z.date().optional(),
  bio: z.string().optional(),
  agree: z.literal(true, { message: 'Wajib centang' }),
})

export const schema = z.object({
  name: z.string().min(1, 'Nama wajib'),
  email: z.string().email('Email tidak valid'),
  role: z.string().min(1, 'Pilih role'),
  bio: z.string().min(10, 'Bio minimal 10 karakter'),
})

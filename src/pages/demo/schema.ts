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
  items: z.array(
    z.object({
      product: z.string().min(1, 'Nama produk wajib'),
      qty: z.coerce.number().min(1, 'Qty > 0'),
      price: z.coerce.number().min(1, 'Harga > 0'),
    })
  ),
})

export const schema = z.object({
  name: z.string().min(1, 'Nama wajib'),
  email: z.string().email('Email tidak valid'),
  role: z.string().min(1, 'Pilih role'),
  bio: z.string().min(10, 'Bio minimal 10 karakter'),
  items: z.array(
    z.object({
      product: z.string().min(1, 'Nama produk wajib'),
      qty: z.coerce.number().min(1, 'Qty harus lebih dari 0'),
      price: z.coerce.number().min(1, 'Harga harus lebih dari 0'),
    })
  ),
})

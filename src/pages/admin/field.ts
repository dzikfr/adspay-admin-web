import { type FieldConfig } from '@/types/field_form'

export const createAdminFields: FieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Masukkan username',
    required: true,
  },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Masukkan email', required: true },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Masukkan password',
    required: true,
  },
]

export const updateAdminFields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Masukkan email', required: true },
]

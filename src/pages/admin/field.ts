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
  {
    name: 'confirmPassword',
    label: 'Cosnfirm Password',
    type: 'password',
    placeholder: 'Konfirmasi password',
    required: true,
  },
]

export const updateAdminFields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Masukkan email', required: true },
]

export const resetPasswordAdminFields: FieldConfig[] = [
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Masukkan password',
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Konfirmasi password',
    required: true,
  },
]

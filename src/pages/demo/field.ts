// Field digunakan untuk bentuk field form secara dinamis

import { type FieldConfig } from '@/types/field_form'

export const tabs = [
  {
    id: 'info',
    label: 'Information',
    fields: [
      {
        name: 'name',
        label: 'Nama',
        type: 'text',
        required: true,
        placeholder: 'Masukkan nama',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        placeholder: 'Masukkan email',
      },
    ] as FieldConfig[],
  },
  {
    id: 'details',
    label: 'Details',
    fields: [
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        placeholder: 'Pilih role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'textarea',
        required: false,
        placeholder: 'Ceritakan tentang dirimu',
      },
    ] as FieldConfig[],
  },
]

export const demoFields: FieldConfig[] = [
  { name: 'name', label: 'Nama', type: 'text', placeholder: 'Masukkan nama', required: true },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Masukkan email', required: true },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    placeholder: 'Pilih role',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
  },
  { name: 'avatar', label: 'Foto Profil', type: 'file', required: false },
  {
    name: 'startDate',
    label: 'Tanggal Mulai',
    type: 'date',
    placeholder: 'Pilih tanggal',
    required: false,
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Ceritakan tentang dirimu',
    required: false,
  },
  {
    name: 'agree',
    label: 'Setuju dengan syarat',
    type: 'checkbox',
    placeholder: 'Ya, saya setuju',
    required: true,
  },
]

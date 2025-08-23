import { z } from 'zod'
import { DynamicFormModal } from '@/components/layout/DynamicFormModals'
import { DynamicTabbedFormModal } from '@/components/layout/DynamicTabbedFormModal'
import { DynamicTable } from '@/components/layout/DynamicalTable'
import { type FieldConfig } from '@/types/field_form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { type ColumnConfig } from '@/types/table'
import { Trash, Pencil, Eye, CheckLine } from 'lucide-react'

const demoSchema = z.object({
  name: z.string().min(1, 'Nama wajib'),
  email: z.string().min(1, 'Email wajib').email({ message: 'Email tidak valid' }),
  role: z.string().min(1, 'Pilih role'),
  avatar: z.union([z.instanceof(File), z.null()]).optional(),
  startDate: z.date().optional(),
  bio: z.string().optional(),
  agree: z.literal(true, { message: 'Wajib centang' }),
})

const schema = z.object({
  name: z.string().min(1, 'Nama wajib'),
  email: z.string().email('Email tidak valid'),
  role: z.string().min(1, 'Pilih role'),
  bio: z.string().min(10, 'Bio minimal 10 karakter'),
})

const tabs = [
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

const demoFields: FieldConfig[] = [
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

type User = {
  id: number
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@mail.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@mail.com', role: 'User' },
]

const userColumns: ColumnConfig<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

export function DemoPage() {
  const [open, setOpen] = useState(false)
  const [openTabbed, setOpenTabbed] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Buka Form Demo</Button>
      <DynamicFormModal
        schema={demoSchema}
        fields={demoFields}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={async values => {
          console.log('Form Values:', values)

          if (values.avatar) {
            const fd = new FormData()
            fd.append('avatar', values.avatar)
            fd.append('name', values.name)
            await fetch('/api/upload', { method: 'POST', body: fd })
          }
        }}
      />

      <Button onClick={() => setOpenTabbed(true)}>Buka Tabbed Form Demo</Button>
      <DynamicTabbedFormModal
        schema={schema}
        tabs={tabs}
        isOpen={openTabbed}
        onClose={() => setOpenTabbed(false)}
        onSubmit={values => console.log(values)}
      />

      <DynamicTable
        data={users}
        columns={userColumns}
        caption="Daftar Pengguna"
        actions={row => (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => console.log('View', row)}>
              <Eye />
            </Button>
            <Button size="sm" variant="default" onClick={() => console.log('Edit', row)}>
              <Pencil />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => console.log('Verify', row)}>
              <CheckLine />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => console.log('Delete', row)}>
              <Trash />
            </Button>
          </div>
        )}
      />
    </>
  )
}

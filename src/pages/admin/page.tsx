import { DynamicFormModal } from '@/components/layout/DynamicFormModals'
import { DynamicTable } from '@/components/layout/DynamicalTable'
import { useState, useEffect } from 'react'
import { type ColumnConfig } from '@/types/table'
import { Trash, Pencil, DiamondPlus } from 'lucide-react'
import { ButtonActionDynamic } from '@/components/layout/ButtonActionDynamic'
import { createAdminFields, updateAdminFields } from './field'
import { createAdminSchema, updateAdminSchema } from './schema'
import { getListAdmin, createAdmin, updateAdmin } from '@/services/user/admin'

const userColumns: ColumnConfig<AdminType>[] = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'enabled', label: 'Status' },
]

export type AdminType = {
  id: number
  username: string
  email: string
  enabled: boolean
  role: string[]
}

export function ListAdminPage() {
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await getListAdmin()
      setAdmins(
        res.map((user: any) => ({
          id: Number(user.id),
          username: user.username,
          email: user.email,
          enabled: user.enabled,
          role: user.roles,
        }))
      )
    } catch (err) {
      console.error('Failed fetching admins:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <ButtonActionDynamic
        icon={<DiamondPlus className="h-4 w-4" />}
        tooltip="Tambahkan Admin"
        variant="default"
        onClick={() => setCreateModalOpen(true)}
      />

      {/* Table */}
      <DynamicTable
        data={admins}
        columns={userColumns}
        caption="Daftar Admin"
        actions={row => (
          <div className="flex gap-2 justify-end">
            <ButtonActionDynamic
              icon={<Pencil className="h-4 w-4" />}
              tooltip="Edit"
              variant="default"
              onClick={() => setUpdateModalOpen(true)}
            />
            <ButtonActionDynamic
              icon={<Trash className="h-4 w-4" />}
              tooltip="Hapus"
              variant="destructive"
              onClick={() => console.log('Delete', row)}
            />
          </div>
        )}
      />

      {/* Modals Create */}
      <DynamicFormModal
        schema={createAdminSchema}
        fields={createAdminFields}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async values => {
          await createAdmin(values.username, values.email, values.password)
        }}
        onSuccess={fetchUsers}
      />

      {/* Modals Update */}
      <DynamicFormModal
        schema={updateAdminSchema}
        fields={updateAdminFields}
        isOpen={updateModalOpen}
        isEdit={true}
        onClose={() => setUpdateModalOpen(false)}
        onSubmit={async values => {
          if (admins.length > 0) {
            await updateAdmin(admins[2].id.toString(), values.email)
          }
        }}
      />
    </>
  )
}

import { DynamicFormModal } from '@/components/layout/DynamicFormModals'
import { DynamicTable } from '@/components/layout/DynamicalTable'
import { useState, useEffect } from 'react'
import { type ColumnConfig } from '@/types/table'
import { Power, PowerOff, Pencil, DiamondPlus, KeySquare } from 'lucide-react'
import { ButtonActionDynamic } from '@/components/layout/ButtonActionDynamic'
import { createAdminFields, updateAdminFields, resetPasswordAdminFields } from './field'
import { createAdminSchema, updateAdminSchema, resetPasswordAdminSchema } from './schema'
import { ConfirmModal } from '@/components/layout/ConfirmModal'
import {
  getListAdmin,
  createAdmin,
  updateAdmin,
  activateAdmin,
  deactivateAdmin,
  resetPasswordAdmin,
} from '@/services/user/admin'
import { toast } from 'sonner'

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
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    description: string
    action: () => Promise<void>
  } | null>(null)

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
      toast.error('Failed fetching admins')
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
        actions={row => {
          const isSuperAdmin = row.role.includes('SUPERADMIN')

          return (
            <div className="flex gap-2 justify-end">
              {/* Edit*/}
              <ButtonActionDynamic
                icon={<Pencil className="h-4 w-4" />}
                tooltip="Edit"
                variant="default"
                onClick={() => {
                  setSelectedAdmin(row)
                  setUpdateModalOpen(true)
                }}
              />

              {/* Aktifkan*/}
              {row.enabled === false && !isSuperAdmin && (
                <ButtonActionDynamic
                  icon={<Power className="h-4 w-4" />}
                  tooltip="Aktifkan"
                  variant="default"
                  onClick={() => {
                    setConfirmConfig({
                      title: 'Aktifkan Admin',
                      description: `Yakin mau aktifkan ${row.username}?`,
                      action: async () => {
                        try {
                          await activateAdmin(row.username)
                          toast.success(`Admin ${row.username} berhasil diaktifkan`)
                        } catch (error) {
                          console.error(error)
                          toast.error(`Gagal mengaktifkan admin ${row.username}`)
                        } finally {
                          await fetchUsers()
                        }
                      },
                    })
                    setConfirmOpen(true)
                  }}
                />
              )}

              {/* Non-aktifkan*/}
              {row.enabled === true && !isSuperAdmin && (
                <ButtonActionDynamic
                  icon={<PowerOff className="h-4 w-4" />}
                  tooltip="Non-aktifkan"
                  variant="default"
                  onClick={() => {
                    setConfirmConfig({
                      title: 'Non-aktifkan Admin',
                      description: `Yakin mau non-aktifkan ${row.username}?`,
                      action: async () => {
                        try {
                          await deactivateAdmin(row.username)
                          toast.success(`Admin ${row.username} berhasil dinon-aktifkan`)
                        } catch (error) {
                          console.error(error)
                          toast.error(`Gagal menon-aktifkan admin ${row.username}`)
                        } finally {
                          await fetchUsers()
                        }
                      },
                    })
                    setConfirmOpen(true)
                  }}
                />
              )}

              {/* Reset Password*/}
              <ButtonActionDynamic
                icon={<KeySquare className="h-4 w-4" />}
                tooltip="Reset Password"
                variant="default"
                onClick={() => {
                  setSelectedAdmin(row)
                  setChangePasswordModalOpen(true)
                }}
              />
            </div>
          )
        }}
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
        onSuccess={async () => {
          toast.success('Admin berhasil ditambahkan')
          await fetchUsers()
        }}
        failedLabel="Gagal menambahkan admin"
      />

      {/* Modals Update */}
      <DynamicFormModal
        schema={updateAdminSchema}
        fields={updateAdminFields}
        isOpen={updateModalOpen}
        isEdit={true}
        editData={selectedAdmin ? { email: selectedAdmin.email } : undefined}
        onClose={() => {
          setUpdateModalOpen(false)
          setSelectedAdmin(null)
        }}
        onSubmit={async values => {
          if (selectedAdmin) {
            await updateAdmin(selectedAdmin.username.toString(), values.email)
          }
        }}
        onSuccess={async () => {
          toast.success(`Admin ${selectedAdmin?.username} berhasil diupdate`)
          await fetchUsers()
        }}
        failedLabel="Gagal mengupdate admin"
      />

      {/* Modals Change Password */}
      <DynamicFormModal
        schema={resetPasswordAdminSchema}
        fields={resetPasswordAdminFields}
        isOpen={changePasswordModalOpen}
        isEdit={true}
        onClose={() => {
          setChangePasswordModalOpen(false)
          setSelectedAdmin(null)
        }}
        onSubmit={async values => {
          if (selectedAdmin) {
            await resetPasswordAdmin(selectedAdmin.username.toString(), values.newPassword)
          }
        }}
        onSuccess={async () => {
          toast.success(`Password Admin ${selectedAdmin?.username} berhasil diubah`)
          await fetchUsers()
        }}
        failedLabel="Gagal mengubah password admin"
      />

      {confirmConfig && (
        <ConfirmModal
          isOpen={confirmOpen}
          title={confirmConfig.title}
          description={confirmConfig.description}
          onConfirm={confirmConfig.action}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}

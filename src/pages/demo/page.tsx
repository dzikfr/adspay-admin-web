import { DynamicFormModal } from '@/components/layout/DynamicFormModals'
import { DynamicTabbedFormModal } from '@/components/layout/DynamicTabbedFormModal'
import { DynamicTable } from '@/components/layout/DynamicalTable'
import { useState } from 'react'
import { type ColumnConfig } from '@/types/table'
import { Trash, Pencil, Eye, CheckLine, SquarePlus, DiamondPlus } from 'lucide-react'
import { ButtonActionDynamic } from '@/components/layout/ButtonActionDynamic'
import { users } from './dummy'
import { tabs, demoFields } from './field'
import { demoSchema, schema } from './schema'
import { type UserType } from '@/types/demo/type'

const userColumns: ColumnConfig<UserType>[] = [
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
      <ButtonActionDynamic
        icon={<DiamondPlus className="h-4 w-4" />}
        tooltip="Buka Single Form Demo"
        variant="default"
        onClick={() => setOpen(true)}
      />
      <ButtonActionDynamic
        icon={<SquarePlus className="h-4 w-4" />}
        tooltip="Buka Tabbed Form Demo"
        variant="outline"
        onClick={() => setOpenTabbed(true)}
      />

      {/* Table */}
      <DynamicTable
        data={users}
        columns={userColumns}
        caption="Daftar Pengguna"
        actions={row => (
          <div className="flex gap-2 justify-end">
            <ButtonActionDynamic
              icon={<Eye className="h-4 w-4" />}
              tooltip="Lihat Detail"
              variant="outline"
              onClick={() => console.log('View', row)}
            />
            <ButtonActionDynamic
              icon={<Pencil className="h-4 w-4" />}
              tooltip="Edit"
              variant="default"
              onClick={() => console.log('Edit', row)}
            />
            <ButtonActionDynamic
              icon={<CheckLine className="h-4 w-4" />}
              tooltip="Verifikasi"
              variant="secondary"
              onClick={() => console.log('Verify', row)}
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

      {/* Modals */}
      <DynamicFormModal
        schema={demoSchema}
        fields={demoFields}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={values => console.log('Form Values:', values)}
      />

      <DynamicTabbedFormModal
        schema={schema}
        tabs={tabs}
        isOpen={openTabbed}
        onClose={() => setOpenTabbed(false)}
        onSubmit={values => console.log('Tabbed Form Values:', values)}
      />
    </>
  )
}

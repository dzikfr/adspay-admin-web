import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
  useFieldArray,
} from 'react-hook-form'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'

interface ColumnConfig {
  label: string
  key: string
  type?: string
}

interface DynamicFormTableFieldProps {
  name: string
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors
  columns: ColumnConfig[]
}

export function DynamicFormTableField({
  name,
  control,
  register,
  errors,
  columns,
}: DynamicFormTableFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name })

  return (
    <div className="space-y-2 col-span-2">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              {columns.map(col => {
                const rowErrors =
                  errors && errors[name] && Array.isArray(errors[name])
                    ? (errors[name] as any[])
                    : undefined
                const fieldError = rowErrors?.[index]?.[col.key] as { message?: string } | undefined

                return (
                  <TableCell key={col.key}>
                    <input
                      className="border p-1 rounded w-full"
                      type={col.type ?? 'text'}
                      {...register(`${name}.${index}.${col.key}` as const)}
                    />
                    {fieldError?.message && (
                      <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                    )}
                  </TableCell>
                )
              })}
              <TableCell>
                <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(Object.fromEntries(columns.map(c => [c.key, ''])))}
      >
        <Plus className="w-4 h-4 mr-1" /> Tambah Baris
      </Button>
    </div>
  )
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { Button } from '@/components/ui/button'

export interface ColumnConfig<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DynamicTableProps<T> {
  data: T[]
  columns: ColumnConfig<T>[]
  caption?: string
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode // untuk tombol edit/delete
}

export function DynamicTable<T>({
  data,
  columns,
  caption,
  onRowClick,
  actions,
}: DynamicTableProps<T>) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={String(col.key)} className={col.className}>
              {col.label}
            </TableHead>
          ))}
          {actions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              {columns.map(col => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </TableCell>
              ))}
              {actions && <TableCell className="text-right">{actions(row)}</TableCell>}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

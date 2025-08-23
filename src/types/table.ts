export interface ColumnConfig<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DynamicTableProps<T extends object> {
  data: T[]
  columns: ColumnConfig<T>[]
  caption?: string
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
}

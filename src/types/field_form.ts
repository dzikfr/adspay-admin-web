export type FieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'textarea'
  | 'date'
  | 'table'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { label: string; value: string }[] | { label: string; key: string; type?: string }[]
  required?: boolean
}

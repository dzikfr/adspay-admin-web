export type FieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'textarea'
  | 'date'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
}

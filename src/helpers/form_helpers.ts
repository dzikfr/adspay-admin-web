import { type FieldConfig } from '@/types/field_form'
import { z } from 'zod'

export function getDefaultValues<T extends z.ZodTypeAny>(
  fields: FieldConfig[],
  editData?: Partial<z.infer<T>>
): Partial<z.infer<T>> {
  const defaults: Record<string, any> = {}

  for (const field of fields) {
    if (editData && field.name in editData) {
      defaults[field.name] = editData[field.name as keyof typeof editData]
      continue
    }

    switch (field.type) {
      case 'text':
      case 'number':
      case 'password':
      case 'textarea':
      case 'select':
        defaults[field.name] = ''
        break
      case 'checkbox':
        defaults[field.name] = false
        break
      case 'file':
        defaults[field.name] = null
        break
      case 'date':
        defaults[field.name] = undefined
        break
      default:
        defaults[field.name] = ''
    }
  }

  return defaults as Partial<z.infer<T>>
}

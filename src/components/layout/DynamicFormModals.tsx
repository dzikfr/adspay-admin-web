import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { type FieldConfig } from '@/types/field_form'
import { getDefaultValues } from '@/helpers/form_helpers'
import { DynamicFormTableField } from './DynamicFormTableField'

interface DynamicFormModalProps<T extends z.ZodType<any, any>> {
  schema: T
  fields: FieldConfig[]
  onSubmit: (values: z.infer<T>) => Promise<void> | void
  isOpen: boolean
  onClose: () => void
  isEdit?: boolean
  editData?: Partial<z.infer<T>>
  submitLabel?: string
}

export function DynamicFormModal<T extends z.ZodType<any, any>>({
  schema,
  fields,
  onSubmit,
  isOpen,
  onClose,
  isEdit = false,
  editData,
  submitLabel,
}: DynamicFormModalProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues: getDefaultValues<T>(fields, editData) as import('react-hook-form').DefaultValues<
      z.infer<T>
    >,
  })

  const handleSubmit = async (data: z.infer<T>) => {
    await onSubmit(data)
    form.reset(getDefaultValues<T>(fields) as any)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Data' : 'Add Data'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {fields.map(field => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as any}
                render={({ field: rhfField }) => (
                  <FormItem
                    className={
                      field.type === 'textarea' || field.type === 'table'
                        ? 'col-span-2'
                        : 'col-span-1'
                    }
                  >
                    <FormLabel>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </FormLabel>
                    <FormControl>
                      {field.type === 'table' ? (
                        <DynamicFormTableField
                          name={field.name}
                          control={form.control}
                          register={form.register}
                          errors={form.formState.errors}
                          columns={
                            field.options
                              ? field.options.map(opt => ({
                                  label: opt.label,
                                  key: 'key' in opt ? opt.key : (opt as any).value,
                                  type: (opt as any).type,
                                }))
                              : []
                          }
                        />
                      ) : field.type === 'file' ? (
                        <Input
                          type="file"
                          accept={field.options
                            ?.map(o => ('value' in o ? o.value : undefined))
                            .filter((v): v is string => !!v)
                            .join(',')}
                          onChange={e => {
                            const file = e.target.files?.[0] || null
                            rhfField.onChange(file)
                          }}
                        />
                      ) : field.type === 'text' ||
                        field.type === 'number' ||
                        field.type === 'password' ? (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...rhfField}
                          value={rhfField.value ?? ''}
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          placeholder={field.placeholder}
                          {...rhfField}
                          value={rhfField.value ?? ''}
                        />
                      ) : field.type === 'select' ? (
                        <Select value={rhfField.value} onValueChange={rhfField.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map(opt => (
                              <SelectItem
                                key={'value' in opt ? opt.value : opt.key}
                                value={'value' in opt ? opt.value : opt.key}
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={!!rhfField.value}
                            onCheckedChange={rhfField.onChange}
                          />
                          <span>{field.placeholder}</span>
                        </div>
                      ) : field.type === 'date' ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              {rhfField.value ? (
                                format(new Date(rhfField.value), 'PPP')
                              ) : (
                                <span>{field.placeholder ?? 'Pilih tanggal'}</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={rhfField.value ? new Date(rhfField.value) : undefined}
                              onSelect={date => rhfField.onChange(date)}
                              defaultMonth={new Date()}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : null}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="col-span-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">{submitLabel ?? (isEdit ? 'Update' : 'Save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

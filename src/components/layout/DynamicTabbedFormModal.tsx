import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon, Eye, EyeOff } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type FieldConfig } from '@/types/field_form'
import { getDefaultValues } from '@/helpers/form_helpers'
import { DynamicFormTableField } from './DynamicFormTableField'
import { useEffect, useState } from 'react'

interface TabConfig {
  id: string
  label: string
  fields: FieldConfig[]
}

interface DynamicTabbedFormModalProps<T extends z.ZodType<any, any>> {
  schema: T
  tabs: TabConfig[]
  onSubmit: (values: z.infer<T>) => Promise<void> | void
  isOpen: boolean
  onClose: () => void
  isEdit?: boolean
  editData?: Partial<z.infer<T>>
  submitLabel?: string
}

export function DynamicTabbedFormModal<T extends z.ZodType<any, any>>({
  schema,
  tabs,
  onSubmit,
  isOpen,
  onClose,
  isEdit = false,
  editData,
  submitLabel,
}: DynamicTabbedFormModalProps<T>) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  const togglePasswordVisibility = (fieldName: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues: getDefaultValues<T>(
      tabs.flatMap(tab => tab.fields),
      editData
    ) as import('react-hook-form').DefaultValues<z.infer<T>>,
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(
        getDefaultValues<T>(
          tabs.flatMap(tab => tab.fields),
          editData
        ) as any
      )
    }
  }, [editData, isOpen])

  const handleSubmit = async (data: z.infer<T>) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto w-[800px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Data' : 'Add Data'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs defaultValue={tabs[0]?.id} className="w-full">
              <TabsList className="mb-4">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tab.fields.map(field => (
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
                                          key: 'value' in opt ? opt.value : opt.key,
                                          type: (opt as any).type,
                                        }))
                                      : []
                                  }
                                />
                              ) : field.type === 'file' ? (
                                <Input
                                  type="file"
                                  accept={field.options
                                    ?.map(o => ('value' in o ? o.value : ''))
                                    .join(',')}
                                  onChange={e => {
                                    const file = e.target.files?.[0] || null
                                    rhfField.onChange(file)
                                  }}
                                />
                              ) : field.type === 'text' || field.type === 'number' ? (
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
                              ) : field.type === 'password' ? (
                                <div className="relative">
                                  <Input
                                    type={visiblePasswords[field.name] ? 'text' : 'password'}
                                    placeholder={field.placeholder}
                                    {...rhfField}
                                    value={rhfField.value ?? ''}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(field.name)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                  >
                                    {visiblePasswords[field.name] ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              ) : field.type === 'select' ? (
                                <Select value={rhfField.value} onValueChange={rhfField.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map(opt => (
                                      <SelectItem
                                        key={'value' in opt ? opt.value : (opt as any).key}
                                        value={'value' in opt ? opt.value : (opt as any).key}
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
                                      selected={
                                        rhfField.value ? new Date(rhfField.value) : undefined
                                      }
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
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <DialogFooter className="mt-6">
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

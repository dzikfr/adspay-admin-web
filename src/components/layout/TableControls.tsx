import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

export function TableControls({
  label,
  search,
  onSearchChange,
  filterValue,
  onFilterChange,
  options,
}: {
  label: string
  search: string
  onSearchChange: (v: string) => void
  filterValue: string
  onFilterChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex gap-4 items-center my-4">
      <input
        className="border px-2 py-1 rounded"
        placeholder={`Search ${label}…`} // misalnya "Search Admin…"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />

      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={`Filter ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {/* label “All” sekarang jadi jelas */}
          <SelectItem value="__ALL__">{`${label}`}</SelectItem>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

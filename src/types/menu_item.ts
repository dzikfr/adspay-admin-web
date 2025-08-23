export type MenuItemType = {
  title: string
  url?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: MenuItemType[]
}

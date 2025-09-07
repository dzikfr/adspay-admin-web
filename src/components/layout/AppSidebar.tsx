import { Home, Inbox, ChevronRight, Bird, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import type { MenuItemType } from '@/types/menu_item'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/services/auth/auth'

const items: MenuItemType[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'About', url: '/about', icon: Inbox },
  { title: 'Demo', url: '/demo', icon: Bird },
  {
    title: 'User',
    icon: User,
    children: [{ title: 'Saldo', url: '/saldo' }],
  },
  {
    title: 'Procurement',
    icon: Inbox,
    children: [
      { title: 'Budgeting', url: '/budgeting' },
      { title: 'Purchase Request', url: '/purchase-request' },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (url?: string) =>
    !!url && (location.pathname === url || location.pathname.startsWith(url + '/'))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AdsPay</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const hasChildren = !!item.children?.length
                const groupActive = hasChildren
                  ? item.children!.some(c => isActive(c.url))
                  : isActive(item.url)

                if (!hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url!} aria-current={groupActive ? 'page' : undefined}>
                          {item.icon ? <item.icon className="size-4" /> : null}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={groupActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon ? <item.icon className="size-4" /> : null}
                          <span>{item.title}</span>
                          <ChevronRight
                            className={cn(
                              'ml-auto size-4 transition-transform',
                              'group-data-[state=open]/collapsible:rotate-90'
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children!.map(child => {
                            const active = isActive(child.url)
                            return (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton asChild>
                                  {child.url ? (
                                    <Link
                                      to={child.url}
                                      aria-current={active ? 'page' : undefined}
                                      className={cn(active && 'bg-accent text-accent-foreground')}
                                    >
                                      <span>{child.title}</span>
                                    </Link>
                                  ) : (
                                    <span
                                      className={cn(active && 'bg-accent text-accent-foreground')}
                                    >
                                      {child.title}
                                    </span>
                                  )}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton>
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah kamu yakin ingin keluar dari aplikasi?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

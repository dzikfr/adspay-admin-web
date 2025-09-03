import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Outlet } from 'react-router-dom'
import { ModeToggle } from '@/components/layout/ModeToggle'
import { AppBreadcrumb } from './components/layout/AppBreadCrumb'

export default function Layout() {
  return (
    <SidebarProvider
      style={{
        ['--sidebar-width' as any]: '20rem',
        ['--sidebar-width-mobile' as any]: '20rem',
      }}
    >
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="relative p-4 flex items-center border-b">
            <SidebarTrigger />
            <div className="ml-4">
              <AppBreadcrumb />
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="font-bold">Admin Dashboard</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

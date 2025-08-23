import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Outlet } from 'react-router-dom'
import { ModeToggle } from '@/components/layout/ModeToggle'

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
          <div className="p-4 flex items-center border-b">
            <SidebarTrigger />

            <div className="flex-1 flex justify-center">
              <span className="font-bold">Admin Dashboard</span>
            </div>

            <div className="flex items-center gap-2">
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

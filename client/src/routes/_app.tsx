import { Navbar } from '@/components/Navbar'
import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Navbar />
    <Outlet />
  </div>
}

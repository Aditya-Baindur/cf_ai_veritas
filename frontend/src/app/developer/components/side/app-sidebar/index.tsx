'use client'

import type { Dispatch, SetStateAction } from 'react'
import { MobileSidebar, SidebarBody } from '../../ui/sidebar'

import AppSidebarContent from './app-sidebar-content'

export default function AppSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <MobileSidebar
        open={mobileOpen}
        setOpen={setMobileOpen}
        className="md:hidden"
      >
        <AppSidebarContent />
      </MobileSidebar>
      <div className="hidden h-full md:block">
        <SidebarBody className="p- flex h-full flex-col gap-4">
          <AppSidebarContent />
        </SidebarBody>
      </div>
    </>
  )
}

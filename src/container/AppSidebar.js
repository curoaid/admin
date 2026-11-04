import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import Nav from 'src/_nav'
import { useGlobalStore } from 'src/utils/store'

const AppSidebar = () => {

  const { sidebarShow, setSidebarVisible } = useGlobalStore((state) => state)
  const location = useLocation()

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767.98px)')
    const closeOnMobile = () => {
      if (mobileQuery.matches) {
        setSidebarVisible(false)
      }
    }

    closeOnMobile()
    mobileQuery.addEventListener('change', closeOnMobile)

    return () => mobileQuery.removeEventListener('change', closeOnMobile)
  }, [location.pathname, setSidebarVisible])

  return (
    <CSidebar
      className="app-sidebar"
      position="fixed"
      unfoldable={false}
      visible={sidebarShow}
      onVisibleChange={setSidebarVisible}
    >
      <CSidebarBrand className="app-sidebar-brand" to="/">
       <span className="app-brand-wordmark">CuroAid</span>
      </CSidebarBrand>
      <CSidebarNav className="sidebar-nav">
        <SimpleBar>
          <AppSidebarNav items={Nav()} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

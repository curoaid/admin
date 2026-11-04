import React from 'react'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu } from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import { useGlobalStore } from 'src/utils/store'

const AppHeader = () => {

  const { setSidebarShow, notifyCount, notify } = useGlobalStore((state) => state)

  return (
    <CHeader position="sticky" className="app-header">
      <CContainer fluid>
        <CHeaderToggler
          className="app-header-toggler"
          onClick={setSidebarShow}
          aria-label="Toggle navigation"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="app-header-brand d-md-none" to="/">
          <span className="app-brand-wordmark">CuroAid</span>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          {/* <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="/adminpanel/notification" className="position-relative">
              <CIcon icon={cilBell} size="lg" />
              {notify && (
                <span className="position-absolute top-2 start-80 translate-middle badge rounded-pill bg-primary">
                  {notifyCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider className="mb-0" />
    </CHeader>
  )
}

export default AppHeader

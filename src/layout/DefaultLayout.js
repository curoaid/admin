import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../container/index'

const DefaultLayout = () => {
  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body app-content-area flex-grow-1 px-3 pt-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

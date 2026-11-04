import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = ({setShowBreadCrumb}) => {
  const currentLocation = useLocation().pathname



  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  console.log(routes,"routes");

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
   
    location.split('/').reduce((prev, curr, index, array) => {
      console.log(prev, curr,"location");
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }


  const breadcrumbs = getBreadcrumbs(currentLocation)


// useEffect(() => {
//   if(breadcrumbs?.length == 0){
//     setShowBreadCrumb(false)
//   }else{
//     setShowBreadCrumb(true)
//   }
// }, [currentLocation])
  


 

  

  console.log(breadcrumbs,"breadcrumbs");

  return (
    <CBreadcrumb className="m-0 ms-2"  >
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            // {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
            className="bdc-item"
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)

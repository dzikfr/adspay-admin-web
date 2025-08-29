import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

export function AppBreadcrumb() {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/"></Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((segment, idx) => {
          const url = '/' + paths.slice(0, idx + 1).join('/')
          const isLast = idx === paths.length - 1

          return (
            <React.Fragment key={url}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <span className="text-muted-foreground">{segment}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={url}>{segment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

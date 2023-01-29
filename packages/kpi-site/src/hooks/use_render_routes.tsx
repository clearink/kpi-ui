/* eslint-disable import/no-extraneous-dependencies */
import { useMemo } from 'react'
import { Route } from 'react-router-dom'
import { isArray } from '../utils'
import type { RouteItem } from '../routes'

function renderRoutes(routes?: RouteItem[]) {
  if (!isArray(routes)) return undefined

  return routes.map((route) => {
    const { component: RouteComponent, path, children } = route
    const element = <RouteComponent routes={children} />

    return (
      <Route key={path} path={path} element={element}>
        {renderRoutes(children)}
      </Route>
    )
  })
}

export default function useRenderRoutes(routes: RouteItem[]) {
  return useMemo(() => renderRoutes(routes), [routes])
}

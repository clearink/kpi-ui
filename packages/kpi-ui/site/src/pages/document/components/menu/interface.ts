import type { CSSProperties } from 'react'
import type { RouteItem } from 'site/src/routes'

export interface DocumentMenuProps {
  routes?: RouteItem[]
  className?: string
  style?: CSSProperties
}

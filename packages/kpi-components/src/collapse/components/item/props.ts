// utils
import type { SemanticStyledProps, HasChildren } from '@kpi-ui/types'
import type React from 'react'
import type { ExpandedKey } from '../../props'

export interface CollapseItemProps
  extends HasChildren,
    SemanticStyledProps<'root' | 'header' | 'arrow' | 'title' | 'extra' | 'content'>,
    React.DOMAttributes<HTMLDivElement> {
  collapsible?: 'header' | 'arrow' | 'disabled'
  extra?: React.ReactNode
  name: ExpandedKey
  title?: React.ReactNode
  keepMounted?: boolean
  unmountOnExit?: boolean

  arrowIcon?:
    | React.ReactNode
    | ((props: { expanded: boolean; name: CollapseItemProps['name'] }) => React.ReactNode)
  showArrow?: boolean
}

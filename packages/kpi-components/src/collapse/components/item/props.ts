import type { SemanticStyledProps, WithChildren } from '@kpi-ui/types'
import type React from 'react'
import type { ExpandedKey } from '../../props'

export interface CollapseItemProps<K extends ExpandedKey = ExpandedKey>
  extends WithChildren,
    SemanticStyledProps<'root' | 'title' | 'content'>,
    React.DOMAttributes<HTMLDivElement> {
  collapsible?: 'header' | 'arrow' | 'disabled'
  extra?: React.ReactNode
  name: React.Key
  title?: React.ReactNode
  keepMounted?: boolean
  unmountOnExit?: boolean

  arrowIcon?:
    | React.ReactNode
    | ((props: { expanded: boolean; name: CollapseItemProps['name'] }) => React.ReactNode)
  showArrow?: boolean
}

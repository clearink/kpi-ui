import type { SemanticStyledProps, WithChildren } from '@kpi-ui/types'
import type React from 'react'

export interface CollapseItemProps
  extends WithChildren,
    SemanticStyledProps<'root' | 'header' | 'arrow' | 'title' | 'extra' | 'content'>,
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

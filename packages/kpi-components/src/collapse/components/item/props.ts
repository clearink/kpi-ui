import type { SemanticStyledProps, HasChildren } from '@kpi-ui/types'
import type React from 'react'
import type { ExpandedName } from '../../props'

export interface CollapseItemProps
  extends HasChildren,
    SemanticStyledProps<'root' | 'header' | 'icon' | 'title' | 'extra' | 'content'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  extra?: React.ReactNode
  name: ExpandedName
  title?: React.ReactNode
  disabled?: boolean
  showExpandIcon?: boolean

  keepMounted?: boolean
  unmountOnExit?: boolean
  expandIcon?:
    | React.ReactNode
    | ((props: { name: ExpandedName; expanded: boolean }) => React.ReactNode)
}

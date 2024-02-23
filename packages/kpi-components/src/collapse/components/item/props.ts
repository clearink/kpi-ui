import type { SemanticStyledProps, HasChildren } from '@kpi-ui/types'
import type { HTMLAttributes, ReactNode } from 'react'
import type { ExpandedName } from '../../props'

export interface CollapseItemProps
  extends HasChildren,
    SemanticStyledProps<'root' | 'header' | 'icon' | 'title' | 'extra' | 'content'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  name: ExpandedName
  title?: ReactNode
  extra?: ReactNode
  disabled?: boolean
  showExpandIcon?: boolean

  keepMounted?: boolean
  unmountOnExit?: boolean
  expandIcon?: ReactNode | ((props: { name: ExpandedName; expanded: boolean }) => ReactNode)
}

import type { SemanticStyledProps, WithChildren } from '@kpi-ui/types'
import type React from 'react'

export interface CollapsePanelProps
  extends WithChildren,
    SemanticStyledProps<'root' | 'title' | 'content'>,
    React.DOMAttributes<HTMLDivElement> {
  collapsible?: 'header' | 'arrow' | 'disabled'
  extra?: React.ReactNode
  name: React.Key
  title?: React.ReactNode
  keepMounted?: boolean
  unmountOnExit?: boolean

  // Collapse 组件额外传递
  expanded?: boolean
  accordion?: boolean
  transition?: string
  arrowIcon?:
    | React.ReactNode
    | ((props: Pick<CollapsePanelProps, 'expanded' | 'name'>) => React.ReactNode)
  showArrow?: boolean
}

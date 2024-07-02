import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { HTMLAttributes, ReactNode } from 'react'

import type { ExpandedName } from '../../props'

export interface CollapseItemProps
  extends HasChildren,
  SemanticStyledProps<'content' | 'extra' | 'header' | 'icon' | 'root' | 'title'>,
  Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  disabled?: boolean
  expandIcon?: ((props: { expanded: boolean; name: ExpandedName }) => ReactNode) | ReactNode
  extra?: ReactNode
  keepMounted?: boolean
  name: ExpandedName

  showExpandIcon?: boolean
  title?: ReactNode
  unmountOnExit?: boolean
}

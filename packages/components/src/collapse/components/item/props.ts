import type { HasChildren, SemanticStyledProps } from '@comps/_shared/types'
import type { ReactNode } from 'react'

import type { ExpandedName } from '../../props'

export interface CollapseItemProps
  extends HasChildren,
  SemanticStyledProps<'content' | 'extra' | 'header' | 'icon' | 'root' | 'title'> {
  disabled?: boolean
  expandIcon?: ((props: { expanded: boolean, name: ExpandedName }) => ReactNode) | ReactNode
  extra?: ReactNode
  keepMounted?: boolean
  name: ExpandedName

  showExpandIcon?: boolean
  title?: ReactNode
  unmountOnExit?: boolean
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultCollapseItemProps: Partial<CollapseItemProps> = {
  showExpandIcon: true,
}

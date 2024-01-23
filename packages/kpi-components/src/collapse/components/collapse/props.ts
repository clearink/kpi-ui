import type React from 'react'
import type { SizeType } from '../../../_shared/context'
import type { ExpandedName } from '../../props'
import type { CollapseItemProps } from '../item/props'
import type { SemanticStyledProps, HasChildren } from '@kpi-ui/types'

export type CollapseItemType = CollapseItemProps & {
  ref?: React.RefObject<HTMLDivElement>
}

export type CollapsibleType = 'header' | 'icon' | 'title'
export type ExpandIconPosition = 'start' | 'end'
export interface CollapseProps<K extends ExpandedName = ExpandedName>
  extends HasChildren,
    SemanticStyledProps<'root'> {
  items?: CollapseItemType[]
  accordion?: boolean
  expandedNames?: K | K[]
  defaultExpandedNames?: K | K[]
  size?: SizeType
  bordered?: boolean
  ghost?: boolean
  collapsible?: CollapsibleType
  expandIconPosition?: ExpandIconPosition
  onChange?: (expandedName: K, ExpandedNames: K[]) => void

  keepMounted?: boolean
  unmountOnExit?: boolean
  expandIcon?: React.ReactNode | ((props: { name: K; expanded: boolean }) => React.ReactNode)
}

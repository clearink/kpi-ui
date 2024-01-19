import type React from 'react'
import type { SizeType } from '../../../_shared/context'
import type { ExpandedKey } from '../../props'
import type { CollapseItemProps } from '../item/props'
import type { SemanticStyledProps, HasChildren } from '@kpi-ui/types'

export type CollapseItemType = CollapseItemProps & {
  ref?: React.RefObject<HTMLDivElement>
}

export interface CollapseProps extends HasChildren, SemanticStyledProps<'root'> {
  items?: CollapseItemType[]
  accordion?: boolean
  keepMounted?: boolean
  unmountOnExit?: boolean
  expandedKeys?: ExpandedKey | ExpandedKey[]
  defaultExpandedKeys?: ExpandedKey | ExpandedKey[]
  onChange?: (expandedName: ExpandedKey, expandedKeys: ExpandedKey[]) => void
  arrowPlacement?: 'start' | 'end'
  size?: SizeType
  bordered?: boolean
  ghost?: boolean
}

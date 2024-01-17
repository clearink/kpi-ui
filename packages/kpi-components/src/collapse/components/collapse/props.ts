import type React from 'react'
import type { CollapsePanelProps } from '../panel/props'
import type { SizeType } from '../../../_shared/context'

export type ExpandedKey = React.Key | React.Key[]

export interface CollapseProps<K extends ExpandedKey = ExpandedKey> {
  accordion?: boolean
  items: CollapseItemProps[]
  expandedKeys?: K
  defaultExpandedKeys?: K
  onChange?: (expandedKey: K) => void
  placement?: 'start' | 'end'
  size?: SizeType
  bordered?: boolean
  ghost?: boolean
}

export interface CollapseItemProps
  extends Omit<CollapsePanelProps, 'name' | 'expanded' | 'accordion' | 'transition'> {
  key: CollapsePanelProps['name']
  ref?: React.RefObject<HTMLDivElement>
}

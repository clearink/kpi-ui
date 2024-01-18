import type React from 'react'
import type { SizeType } from '../../../_shared/context'
import type { ExpandedKey } from '../../props'
import type { CollapseItemProps } from '../item/props'
import type { SemanticStyledProps, WithChildren } from '@kpi-ui/types'

export type CollapseItemType = Omit<CollapseItemProps, 'name' | 'expanded' | 'accordion'> & {
  key: CollapseItemProps['name']
  ref?: React.RefObject<HTMLDivElement>
}

export interface CollapseProps extends WithChildren, SemanticStyledProps<'root'> {
  items?: CollapseItemType[]
  accordion?: boolean
  expandedKeys?: ExpandedKey
  defaultExpandedKeys?: ExpandedKey
  onChange?: (expandedName: React.Key, expandedKeys: React.Key[]) => void
  placement?: 'start' | 'end'
  size?: SizeType
  bordered?: boolean
  ghost?: boolean
}

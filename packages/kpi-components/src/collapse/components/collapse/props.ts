import type React from 'react'
import type { CollapsePanelProps } from '../panel/props'

export type ExpandedKey = React.Key | React.Key[]

export interface CollapseProps<K extends ExpandedKey> {
  expandedKey?: K
  onChange?: (expandedKey: K) => void
}

export interface CollapseItemProps
  extends Omit<
    CollapsePanelProps,
    'header' | 'panelKey' | 'isActive' | 'accordion' | 'openMotion' | 'expandIcon'
  > {
  key: CollapsePanelProps['panelKey']
  label?: CollapsePanelProps['header']
  ref?: React.RefObject<HTMLDivElement>
}

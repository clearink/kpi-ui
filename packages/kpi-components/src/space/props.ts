import type { HTMLAttributes, ReactNode } from 'react'
import type { Size } from '../config-provider/props'

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'vertical' | 'horizontal'
  size?: Size | [Size, Size]
  split?: ReactNode
  wrap?: boolean
}

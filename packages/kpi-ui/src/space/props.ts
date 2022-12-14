import { HTMLAttributes, ReactNode } from 'react'
import { Size } from '../_internal/types'

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'vertical' | 'horizontal'
  size?: Size | [Size, Size]
  split?: ReactNode
  wrap?: boolean
}

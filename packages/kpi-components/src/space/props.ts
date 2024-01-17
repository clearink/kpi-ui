import type { HTMLAttributes, ReactNode } from 'react'
import type { SizeType } from '../_shared/context'

type SpaceSize = SizeType | number
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'vertical' | 'horizontal'
  size?: SpaceSize | [SpaceSize, SpaceSize]
  split?: ReactNode
  wrap?: boolean
}

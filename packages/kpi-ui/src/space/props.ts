import { HTMLAttributes, ReactNode } from 'react'
import { SizeType } from './assets/constant'

type Size = SizeType | number
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  align: 'start' | 'end' | 'center' | 'baseline'
  direction: 'vertical' | 'horizontal'
  size: Size | [Size, Size]
  split: ReactNode
  wrap: boolean
}

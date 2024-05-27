import type { HTMLAttributes, ReactNode } from 'react'
import type { SizeType } from '../_shared/context'
import { SemanticStyledProps } from '@kpi-ui/types'

type SpaceSize = SizeType | number
export interface SpaceProps extends SemanticStyledProps<'root'>, HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'vertical' | 'horizontal'
  size?: SpaceSize | [SpaceSize, SpaceSize]
  split?: ReactNode
  wrap?: boolean
}

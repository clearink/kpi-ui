import type { SemanticStyledProps } from '@kpi-ui/types'
import type { SizeType } from '_shared/contexts'
import type { HTMLAttributes, ReactNode } from 'react'

type SpaceSize = SizeType | number
export interface SpaceProps extends SemanticStyledProps<'root'>, HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'vertical' | 'horizontal'
  size?: SpaceSize | [SpaceSize, SpaceSize]
  split?: ReactNode
  wrap?: boolean
}

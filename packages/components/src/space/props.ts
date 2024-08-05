import type { SizeType } from '@comps/_shared/contexts'
import type { SemanticStyledProps } from '@comps/_shared/types'
import type { HTMLAttributes, ReactNode } from 'react'

type SpaceSize = SizeType | number

export interface SpaceProps extends SemanticStyledProps<'root'>, HTMLAttributes<HTMLDivElement> {
  align?: 'baseline' | 'center' | 'end' | 'start'
  direction?: 'horizontal' | 'vertical'
  size?: [SpaceSize, SpaceSize] | SpaceSize
  split?: ReactNode
  wrap?: boolean
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultSpaceProps: Partial<SpaceProps> = {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
}

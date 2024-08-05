import type { SemanticStyledProps } from '@comps/_shared/types'
import type { ReactNode } from 'react'

export interface DividerProps extends SemanticStyledProps<'root' | 'text'> {
  align?: 'center' | 'left' | 'right'
  children?: ReactNode
  dashed?: boolean
  direction?: 'horizontal' | 'vertical'
  margin?: number | string
  plain?: boolean
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultDividerProps: Partial<DividerProps> = {
  align: 'center',
  dashed: false,
  direction: 'horizontal',
  plain: false,
}

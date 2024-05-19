import type { SemanticStyledProps } from '@kpi-ui/types'
import type { SizeType } from '../_shared/context'

export type SegmentedRef = HTMLDivElement

export type SegmentedType = string | number

export interface SegmentedOption<T = SegmentedType> {
  className?: string
  disabled?: boolean
  label: React.ReactNode
  value: T
  /**
   * html `title` property for label
   */
  title?: string
}

export interface SegmentedProps<T = SegmentedType>
  extends SemanticStyledProps<'root' | 'group' | 'thumb' | 'item' | 'label'> {
  options: T[] | SegmentedOption<T>[]

  size?: SizeType

  value?: T

  defaultValue?: T

  onChange?: (value: T) => void

  disabled?: boolean
}

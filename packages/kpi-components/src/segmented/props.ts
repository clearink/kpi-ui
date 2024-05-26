import type { SemanticStyledProps } from '@kpi-ui/types'
import type { SizeType } from '../_shared/context'

export type SegmentedType = string | number

export interface SegmentedOption<T extends SegmentedType = SegmentedType>
  extends SemanticStyledProps<'root' | 'label'> {
  disabled?: boolean
  label: React.ReactNode
  value: T
  title?: string
}

export interface SegmentedProps<T extends SegmentedType = SegmentedType>
  extends SemanticStyledProps<'root' | 'group' | 'thumb'> {
  options: T[] | SegmentedOption<T>[]

  size?: SizeType

  value?: T

  defaultValue?: T

  onChange?: (value: T) => void

  disabled?: boolean
}

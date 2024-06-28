import type { SemanticStyledProps } from '@kpi-ui/types'
import type { SizeType } from '_shared/contexts'

export type SegmentedType = string | number

export interface SegmentedOption<T = SegmentedType> extends SemanticStyledProps<'root' | 'label'> {
  disabled?: boolean
  label: React.ReactNode
  value: T
  title?: string
}

export interface SegmentedProps<T = SegmentedType>
  extends SemanticStyledProps<'root' | 'group' | 'thumb'> {
  options: (T | SegmentedOption<T>)[]

  size?: SizeType

  value?: T

  defaultValue?: T

  onChange?: (value: T) => void

  disabled?: boolean

  block?: boolean
}

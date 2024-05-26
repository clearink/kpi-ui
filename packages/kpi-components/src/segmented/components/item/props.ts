import type { SegmentedOption } from '../../props'

export interface SegmentedItemProps extends SegmentedOption {
  prefixCls: string
  checked: boolean
  onChange: (value: SegmentedOption['value']) => void
  title?: string
}

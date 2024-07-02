import type { SegmentedOption } from '../../props'

export interface SegmentedItemProps extends SegmentedOption {
  checked: boolean
  onChange: (value: SegmentedOption['value']) => void
  showThumb: boolean
  title?: string
}

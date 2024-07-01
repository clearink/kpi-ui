import type { SegmentedOption } from '../../props'

export interface SegmentedItemProps extends SegmentedOption {
  checked: boolean
  title?: string
  showThumb: boolean
  onChange: (value: SegmentedOption['value']) => void
}

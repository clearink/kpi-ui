import { useControllableState } from '_shared/hooks'
import { fallback } from '@kpi-ui/utils'

import type { SegmentedOption, SegmentedProps, SegmentedType } from '../props'

export default function useSegmentedValue<T extends SegmentedType = SegmentedType>(
  props: SegmentedProps<T>,
  options: SegmentedOption<T>[],
) {
  const { value, defaultValue, onChange } = props

  return useControllableState({
    value,
    defaultValue: fallback(defaultValue, options[0]?.value),
    onChange,
  })
}

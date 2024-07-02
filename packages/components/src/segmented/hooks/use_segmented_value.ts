import { fallback } from '@kpi-ui/utils'
import { useControllableState } from '_shared/hooks'

import type { SegmentedOption, SegmentedProps, SegmentedType } from '../props'

export default function useSegmentedValue<T extends SegmentedType = SegmentedType>(
  props: SegmentedProps<T>,
  options: SegmentedOption<T>[],
) {
  const { defaultValue, onChange, value } = props

  return useControllableState({
    defaultValue: fallback(defaultValue, options[0]?.value),
    onChange,
    value,
  })
}

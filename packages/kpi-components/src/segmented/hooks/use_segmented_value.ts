import { useControllableState, useEvent } from '@kpi-ui/hooks'
// types
import type { SegmentedProps, SegmentedType } from '../props'

export default function useSegmentedValue<T = SegmentedType>(props: SegmentedProps<T>) {
  const { disabled, value, defaultValue, onChange } = props

  const [state, set] = useControllableState({
    value,
    defaultValue,
    onChange,
  })

  return [
    state,
    useEvent((value: T) => {
      if (disabled) return

      set(value)
    }),
  ] as [typeof state, typeof set]
}

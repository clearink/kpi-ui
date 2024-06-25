import { useWatchValue } from '_hooks'
import { isEqual } from '@kpi-ui/utils'
// types
import type { InternalTooltipProps } from '../props'

export default function useWatchCoords(props: InternalTooltipProps, onCallback: () => void) {
  const { placement, offset, arrow, shift, flip } = props

  const options = { compare: isEqual, listener: onCallback }

  // 影响布局的属性会被 watch
  useWatchValue([placement, offset, arrow, shift, flip], options)
}

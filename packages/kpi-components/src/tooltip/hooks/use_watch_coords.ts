import { useWatchValue } from '@kpi-ui/hooks'
// types
import type { TooltipProps } from '../props'
import { isEqual } from '@kpi-ui/utils'

export default function useWatchCoords(props: TooltipProps, onCallback: () => void) {
  // 影响布局的属性会被 watch
  const values = [props.placement, props.offset, props.arrow, props.shift, props.flip]

  const options = { compare: isEqual, listener: onCallback }

  useWatchValue(values, options)
}

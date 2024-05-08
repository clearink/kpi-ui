import { useWatchValue } from '@kpi-ui/hooks'
// types
import type { TooltipProps } from '../props'
import { isEqual } from '@kpi-ui/utils'

// 监听状态, 重新定位元素
export default function useWatchCoords(props: TooltipProps, onCallback: () => void) {
  const { placement, offset, arrow } = props

  useWatchValue(placement, onCallback)

  const options = { compare: isEqual, listener: onCallback }

  useWatchValue(offset, options)

  useWatchValue(arrow, options)
}

import { useWatchValue } from '@kpi-ui/hooks'
import { isObjectLike } from '@kpi-ui/utils'
// types
import type { TooltipProps } from '../props'

// 监听状态, 重新定位元素
export default function useWatchCoords(props: TooltipProps, onCallback: () => void) {
  const { placement, offset, arrow } = props

  useWatchValue(placement, onCallback)

  useWatchValue(`${offset}`, onCallback)

  useWatchValue(isObjectLike(arrow) && arrow.pointAtCenter, onCallback)
}

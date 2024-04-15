import { useWatchValue } from '@kpi-ui/hooks'
// types
import type { TooltipProps } from '../props'

// 监听状态, 重新定位元素
export default function useWatchCoords(props: TooltipProps, onCallback: () => void) {
  const { placement } = props

  useWatchValue(placement, onCallback)
}

import { useControllableState } from '@kpi-ui/hooks'
// types
import type { TooltipProps } from '../props'

// 当 tooltip 进行 flip 时需要将 placement 对应的 class 改变
export default function useTooltipPlacement(props: TooltipProps) {
  // return useControllableState({
  //   value: props.placement,
  //   onChange: () => {},
  // })
}

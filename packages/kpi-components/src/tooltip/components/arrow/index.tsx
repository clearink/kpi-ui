import { withDisplayName } from '@kpi-ui/utils'
// types
import type { TooltipArrowProps } from './props'

function TooltipArrow(props: TooltipArrowProps) {
  const { className, style } = props
  return <div className={className} style={style} />
}

export default withDisplayName(TooltipArrow)

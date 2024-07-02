import { withDisplayName } from '@kpi-ui/utils'

import type { TooltipArrowProps } from './props'

function TooltipArrow(props: TooltipArrowProps) {
  const { className, show, style } = props

  return show ? <div className={className} style={style} /> : null
}

export default withDisplayName(TooltipArrow)

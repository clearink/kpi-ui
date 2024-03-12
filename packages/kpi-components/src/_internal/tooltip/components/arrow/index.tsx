import { mergeRefs, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useRef, type ForwardedRef } from 'react'
// comps
// types
import type { TooltipArrowProps } from './props'

function TooltipArrow(props: TooltipArrowProps, ref: ForwardedRef<any>) {

  return (
    <div ref={ref} className={classNames.arrow} style={{ ...styles.arrow, ...states.arrowCoords }}></div>
  )
}

export default withDisplayName(forwardRef(TooltipArrow), 'TooltipArrow')

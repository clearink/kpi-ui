// utils
import { usePrefixCls } from '../_shared/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useRef } from 'react'
// comps
import InternalTooltip from '../_internal/tooltip'

// types
import type { TooltipProps } from './props'

const defaultProps: Partial<TooltipProps> = {}

function Tooltip(_props: TooltipProps) {
  const props = withDefaults(_props, defaultProps)

  // const { children } = props

  // return <InternalTooltip>{children}</InternalTooltip>

  return <div>123</div>
}

export default withDisplayName(Tooltip)

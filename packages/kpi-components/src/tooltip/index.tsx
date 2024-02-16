// utils
import { usePrefixCls } from '../_shared/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useRef } from 'react'
// comps

// types
import type { TooltipProps } from './props'

const defaultProps: Partial<TooltipProps> = {}

function Tooltip(_props: TooltipProps) {
  const props = withDefaults(_props, defaultProps)

  return <div>tooltip</div>
}

export default withDisplayName(Tooltip)

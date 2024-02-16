// utils
import { usePrefixCls } from '../_shared/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useRef } from 'react'
// comps
import Overlay from '../_internal/overlay'
// types
import type { PopoverProps } from './props'
import { useComposeRefs, useControllableState } from '@kpi-ui/hooks'

const defaultProps: Partial<PopoverProps> = {}

function Popover(_props: PopoverProps) {
  const props = withDefaults(_props, defaultProps)

  return <div>popover</div>
}

export default withDisplayName(Popover)

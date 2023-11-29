import { ctxHelper, noop } from '@kpi-ui/utils'
import type { LayoutGroupProps, LayoutSharedData } from '../layout-group/props'

export interface LayoutContextState
  extends Required<Pick<LayoutGroupProps, 'onEnter' | 'onEntering' | 'onEntered'>> {
  states: Map<string, LayoutSharedData>
}

export const LayoutContext = ctxHelper<LayoutContextState>({
  states: new Map(),
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
})

import { ctxHelper, noop } from '@kpi-ui/utils'
import type { LayoutGroupProps, SharedLayoutState } from '../layout-group/props'

export interface LayoutContextState
  extends Required<Pick<LayoutGroupProps, 'onReady' | 'onRunning' | 'onFinish'>> {
  states: Map<string, SharedLayoutState>
}

export const LayoutContext = ctxHelper<LayoutContextState>({
  states: new Map(),
  onReady: noop,
  onRunning: noop,
  onFinish: noop,
})

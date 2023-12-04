import { ctxHelper, noop } from '@kpi-ui/utils'
import LayoutGroupStore from '../layout-group/store'

import type { LayoutGroupProps } from '../layout-group/props'

export interface LayoutContextState
  extends Required<Pick<LayoutGroupProps, 'onReady' | 'onRunning' | 'onFinish'>> {
  states: LayoutGroupStore
}

export const LayoutContext = ctxHelper<LayoutContextState>({
  states: new LayoutGroupStore(),
  onReady: noop,
  onRunning: noop,
  onFinish: noop,
})

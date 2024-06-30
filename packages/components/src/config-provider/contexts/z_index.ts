import { ctxHelper } from '@kpi-ui/utils'

export interface ZIndexContextState {
  getZIndex: () => number
}

let baseZIndex = 2000
export const ZIndexContext = ctxHelper<ZIndexContextState>({
  getZIndex: () => baseZIndex++,
})

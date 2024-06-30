import { ctxHelper, noop } from '@kpi-ui/utils'

export interface InternalToolTipContextState {
  (el: Element | null): () => void
}

// 嵌套时的逻辑
export const InternalToolTipContext = ctxHelper<InternalToolTipContextState>(() => noop)

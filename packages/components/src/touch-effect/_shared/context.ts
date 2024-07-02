import { ctxHelper } from '@kpi-ui/utils'

export interface TouchEffectInfo {
  component: string
  event: MouseEvent
  prefixCls: string
  target: HTMLElement | null
}

export interface TouchEffectState {
  disabled?: ((info: TouchEffectInfo) => boolean) | boolean
  showEffect?: (info: TouchEffectInfo) => void
}

export const TouchEffectContext = ctxHelper<TouchEffectState>({})

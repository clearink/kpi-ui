import { ctxHelper } from '@comps/_shared/utils'

export interface TouchEffectInfo {
  component: string
  container: HTMLElement
  event: MouseEvent
  prefixCls: string
  target: HTMLElement | null
}

export interface TouchEffectState {
  disabled?: ((info: TouchEffectInfo) => boolean) | boolean
  showEffect?: (info: TouchEffectInfo) => void
}

export const TouchEffectContext = ctxHelper<TouchEffectState>({})

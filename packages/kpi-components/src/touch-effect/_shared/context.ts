import { ctxHelper } from '@kpi-ui/utils'

export interface TouchEffectInfo {
  event: MouseEvent
  className: string
  component: string
  target: HTMLElement | null
}

export interface TouchEffectState {
  disabled?: boolean | ((info: TouchEffectInfo) => boolean)
  effect?: (info: TouchEffectInfo) => void
}

export const TouchEffectContext = ctxHelper<TouchEffectState>({})

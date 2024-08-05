import { ctxHelper } from '@comps/_shared/utils'

export interface ButtonGroupContextState {
  disabled?: boolean
}

export const ButtonGroupContext = ctxHelper<ButtonGroupContextState>({
})

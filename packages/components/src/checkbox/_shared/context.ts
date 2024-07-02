import { ctxHelper } from '@kpi-ui/utils'

import type { CheckboxOptionType } from '../components/checkbox/props'

export interface CheckboxGroupContextState {
  cancelValue: (val: string) => void
  disabled?: boolean
  name?: string
  registerValue: (val: string) => void
  toggleOption?: (option: CheckboxOptionType) => void
  value?: any
}
export const CheckboxGroupContext = ctxHelper<CheckboxGroupContextState>({
  cancelValue: () => {},
  registerValue: () => {},
})

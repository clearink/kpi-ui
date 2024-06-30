import { ctxHelper } from '@kpi-ui/utils'

import type { CheckboxOptionType } from '../components/checkbox/props'

export interface CheckboxGroupContextState {
  name?: string
  toggleOption?: (option: CheckboxOptionType) => void
  value?: any
  disabled?: boolean
  registerValue: (val: string) => void
  cancelValue: (val: string) => void
}
export const CheckboxGroupContext = ctxHelper<CheckboxGroupContextState>({
  registerValue: () => {},
  cancelValue: () => {},
})

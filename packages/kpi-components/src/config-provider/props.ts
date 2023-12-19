import type { ReactNode } from 'react'
import type { TouchEffectState } from '../_shared/context'

export interface ConfigProviderProps {
  children?: ReactNode
  prefixCls?: string
  touchEffect?: TouchEffectState
}

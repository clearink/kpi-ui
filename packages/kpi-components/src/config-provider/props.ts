import type { ReactNode } from 'react'
import type { TouchEffectState } from '../_shared/context'
import type { SizeType } from './contexts/size'

export interface ConfigProviderProps {
  children?: ReactNode
  prefixCls?: string
  touchEffect?: TouchEffectState
  size?: SizeType
}

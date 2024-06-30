import type { TouchEffectState } from '_shared/contexts'
import type { ReactNode } from 'react'
import type { SpaceProps } from '../space/props'
import type { SizeType } from './contexts/size'

export interface ConfigProviderProps {
  children?: ReactNode
  prefixCls?: string
  touchEffect?: TouchEffectState
  size?: SizeType
  space?: Pick<SpaceProps, 'size' | 'className' | 'classNames' | 'style' | 'styles'>
}

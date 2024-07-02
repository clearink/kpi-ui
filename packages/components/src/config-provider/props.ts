import type { TouchEffectState } from '_shared/contexts'
import type { ReactNode } from 'react'

import type { SpaceProps } from '../space/props'
import type { SizeType } from './contexts/size'

export interface ConfigProviderProps {
  children?: ReactNode
  prefixCls?: string
  size?: SizeType
  space?: Pick<SpaceProps, 'className' | 'classNames' | 'size' | 'style' | 'styles'>
  touchEffect?: TouchEffectState
}

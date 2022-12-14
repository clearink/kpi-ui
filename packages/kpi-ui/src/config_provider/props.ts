import type { ReactNode } from 'react'
import type { RequiredMark } from '../form/props'
import type { DisabledType, SizeType } from '../_internal/types'

export interface ConfigConsumerProps {
  prefixCls?: string
  space?: {
    size?: SizeType | number
  }
  form?: {
    requiredMark?: RequiredMark
    colon?: boolean
  }
}

export interface ConfigProviderProps extends ConfigConsumerProps {
  children?: ReactNode
  componentSize?: SizeType
  componentDisabled?: DisabledType
}

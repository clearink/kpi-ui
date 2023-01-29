import type { ReactNode } from 'react'
import type { DisabledType, SizeType } from '@kpi/shared'
import type { RequiredMark } from '../form/props'

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

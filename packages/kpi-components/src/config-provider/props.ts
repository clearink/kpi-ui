import type { ReactNode } from 'react'
import type { RequiredMark } from '../form/props'

export type SizeType = 'small' | 'middle' | 'large' | undefined

export type DisabledType = true | false | undefined

export type Size = SizeType | number

export interface ConfigConsumerProps {
  prefixCls?: string
  space?: {
    size?: SizeType | number
  }
  form?: {
    requiredMark?: RequiredMark
    colon?: boolean
  }
  wave?: {
    disabled?: boolean
    showEffect?: (target: HTMLElement, event: MouseEvent) => void
  }
}

export interface ConfigProviderProps extends ConfigConsumerProps {
  children?: ReactNode
}

import type { ReactNode } from 'react'
import type { ColProps } from '../../../col/props'
import type { ValidateStatus } from '../../props'

export interface FormItemInputProps {
  wrapperCol?: ColProps
  extra?: ReactNode
  help?: ReactNode
}

export interface FormItemInputExtraProps {
  prefixCls: string
  marginBottom?: number
  validateStatus?: ValidateStatus
  children?: ReactNode
  errors: ReactNode[]
  warnings: ReactNode[]
  onExitComplete: () => void
}

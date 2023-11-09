import type { ReactNode } from 'react'
import type { ColProps } from '../../../col/props'
import type { FieldMeta, ValidateStatus } from '../../props'

export interface FormItemInputProps {
  wrapperCol?: ColProps
  extra?: ReactNode
  help?: ReactNode

  // extra
  prefixCls: string
  validateStatus?: ValidateStatus
  getWrapper: () => HTMLDivElement | null
  children: (
    onMetaChange: (meta: FieldMeta) => void,
    onSubMetaChange: (meta: FieldMeta) => void
  ) => ReactNode
}

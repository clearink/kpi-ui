import type { ReactNode } from 'react'

import type { ColProps } from '../../../col/props'
import type { FieldMeta, ValidateStatus } from '../../props'

export interface FormItemInputProps {
  children: (
    onMetaChange: (meta: FieldMeta) => void,
    onSubMetaChange: (meta: FieldMeta) => void,
  ) => ReactNode
  extra?: ReactNode
  getOuter: () => HTMLDivElement | null

  help?: ReactNode
  // extra
  validateStatus?: ValidateStatus
  wrapperCol?: ColProps
}

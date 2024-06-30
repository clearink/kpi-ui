import type { ColProps } from '../../../col/props'
import type { FormLabelAlign, RequiredMark } from '../../props'

export interface FormItemLabelProps {
  colon?: boolean
  htmlFor?: string
  label?: React.ReactNode
  labelAlign?: FormLabelAlign
  labelCol?: ColProps
  requiredMark?: RequiredMark
  labelWrap?: boolean
  // TODO: 待完善
  tooltip?: any

  // extra
  required?: boolean
}

import cls from 'classnames'
import { ValidateStatus } from '../../../props'
import { FormItemInputProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  status: ValidateStatus,
  wrapperCol: FormItemInputProps['wrapperCol']
) {
  return cls(
    `${prefixCls}__control`,
    status && `${prefixCls}--has-${status}`,
    wrapperCol && wrapperCol.className
  )
}

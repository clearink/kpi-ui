import { cls } from '@kpi-ui/utils'

import type { ValidateStatus } from '../../../props'
import type { FormItemInputProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  status: ValidateStatus,
  wrapperCol: FormItemInputProps['wrapperCol'] = {},
) {
  return cls(prefixCls, status && `${prefixCls}--has-${status}`, wrapperCol.className)
}

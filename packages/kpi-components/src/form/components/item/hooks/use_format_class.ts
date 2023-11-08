import cls from 'classnames'

import type { ValidateStatus } from '../../../props'
import type { FormItemProps } from '../props'

export default function useFormatClass(
  props: FormItemProps,
  validateStatus: ValidateStatus,
  prefixCls: string
) {
  const { hidden, className } = props

  return cls(prefixCls, {
    [`${prefixCls}--hidden`]: hidden,

    // status
    // [`${prefixCls}--has-feedback`]: validateStatus && hasFeedback,
    [`${prefixCls}--has-success`]: validateStatus === 'success',
    [`${prefixCls}--has-warning`]: validateStatus === 'warning',
    [`${prefixCls}--has-error`]: validateStatus === 'error',
    [`${prefixCls}--is-validating`]: validateStatus === 'validating',
    [className!]: !!className,
  })
}

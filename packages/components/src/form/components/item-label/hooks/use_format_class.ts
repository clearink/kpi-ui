import { cls } from '@kpi-ui/utils'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: FormItemLabelProps,
  ctx: FormContextState,
) {
  const { required, colon, labelAlign, labelCol = {}, labelWrap, requiredMark } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${labelAlign}`]: labelAlign,
      [`${prefixCls}--wrap`]: labelWrap,
      [`${prefixCls}--colon`]: colon,
      [`${prefixCls}--required`]: required,
      [`${prefixCls}--required-optional`]: requiredMark === 'optional',
      [`${prefixCls}--has-colon`]: colon && ctx.layout !== 'vertical',
    },
    labelCol.className,
  )
}

import { cls } from '@kpi-ui/utils'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: FormItemLabelProps,
  ctx: FormContextState,
) {
  const { colon, labelAlign, labelCol = {}, labelWrap, required, requiredMark } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${labelAlign}`]: labelAlign,
      [`${prefixCls}--colon`]: colon,
      [`${prefixCls}--has-colon`]: colon && ctx.layout !== 'vertical',
      [`${prefixCls}--required`]: required,
      [`${prefixCls}--required-optional`]: requiredMark === 'optional',
      [`${prefixCls}--wrap`]: labelWrap,
    },
    labelCol.className,
  )
}

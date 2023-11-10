import cls from 'classnames'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: FormItemLabelProps,
  fallbacks: FormContextState
) {
  const { required } = props

  const { colon, labelAlign, labelCol, labelWrap, requiredMark, layout } = fallbacks

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${labelAlign}`]: labelAlign,
      [`${prefixCls}--wrap`]: labelWrap,
      [`${prefixCls}--colon`]: colon,
      [`${prefixCls}--required`]: required,
      [`${prefixCls}--required-optional`]: requiredMark === 'optional',
      [`${prefixCls}--has-colon`]: colon && layout !== 'vertical',
    },
    labelCol && labelCol.className
  )
}

import cls from 'classnames'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

export default function useFormatClass(mergedProps: FormItemLabelProps & FormContextState) {
  const { prefixCls, layout, required, colon, labelWrap, labelAlign, labelCol, requiredMark } =
    mergedProps

  const baseClassName = `${prefixCls}__label`

  return cls(
    baseClassName,
    {
      [`${baseClassName}--${labelAlign}`]: labelAlign,
      [`${baseClassName}--wrap`]: labelWrap,
      [`${baseClassName}--colon`]: colon,
      [`${baseClassName}--required`]: required,
      [`${baseClassName}--required-optional`]: requiredMark === 'optional',
      [`${baseClassName}--has-colon`]: colon && layout !== 'vertical',
    },
    labelCol && labelCol.className
  )
}

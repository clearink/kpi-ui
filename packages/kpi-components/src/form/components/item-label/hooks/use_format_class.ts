import cls from 'classnames'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelExtraProps, FormItemLabelProps } from '../props'

export default function useFormatClass(
  mergedProps: FormItemLabelProps & FormContextState & FormItemLabelExtraProps
) {
  const { prefixCls, layout, required, colon, labelAlign, labelCol, requiredMark } = mergedProps

  const baseClassName = `${prefixCls}__label`

  const colCls = cls(baseClassName, labelCol && labelCol.className, {
    [`${baseClassName}--${labelAlign}`]: labelAlign,
    [`${baseClassName}--colon`]: colon,
  })

  const labelCls = cls({
    [`${baseClassName}--required`]: required,
    [`${baseClassName}--required-optional`]: requiredMark === 'optional',
    [`${baseClassName}--has-colon`]: colon && layout !== 'vertical',
  })

  return [colCls, labelCls] as const
}

import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'

import type { FormContextState } from '../../_internal/context'
import type {
  FormItemLabelProps,
  FormItemLabelExtraProps,
  FormItemProps,
  FormProps,
  RequiredMark,
  ValidateStatus,
} from '../props'
import type { SizeType } from '../../types'

export function useFormClass(
  props: FormProps,
  contextSize: SizeType,
  requiredMark: RequiredMark | undefined
) {
  const { layout, size = contextSize, className } = props

  const name = usePrefixCls('form')

  return cls(name, {
    [`${name}--${layout}`]: layout,
    [`${name}--hide-required-mark`]: requiredMark === false,
    [`${name}--${size}`]: size,
    [className!]: className,
  })
}

export function useFormItemClass(
  props: FormItemProps,
  validateStatus: ValidateStatus,
  prefixCls: string
) {
  const { hidden, className } = props

  return cls(prefixCls, {
    [`${prefixCls}--hidden`]: hidden,

    // Status
    // [`${prefixCls}--has-feedback`]: validateStatus && hasFeedback,
    [`${prefixCls}--has-success`]: validateStatus === 'success',
    [`${prefixCls}--has-warning`]: validateStatus === 'warning',
    [`${prefixCls}--has-error`]: validateStatus === 'error',
    [`${prefixCls}--is-validating`]: validateStatus === 'validating',
    [className!]: !!className,
  })
}

export function useFormItemLabelClass(
  mergedProps: FormItemLabelProps & FormContextState & FormItemLabelExtraProps
) {
  const { prefixCls, layout, required, colon, labelAlign, labelCol, requiredMark } = mergedProps

  const baseClassName = `${prefixCls}__label`

  const colCls = cls(baseClassName, {
    [`${baseClassName}--${labelAlign}`]: labelAlign,
    [`${baseClassName}--colon`]: colon,
    [labelCol?.className!]: labelCol?.className,
  })

  const labelCls = cls({
    [`${baseClassName}--required`]: required,
    [`${baseClassName}--required-optional`]: requiredMark === 'optional',
    [`${baseClassName}--has-colon`]: colon && layout !== 'vertical',
  })

  return [colCls, labelCls] as const
}

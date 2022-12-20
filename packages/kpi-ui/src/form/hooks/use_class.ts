import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'

import type { FormContextState } from '../../_internal/context'
import type { SizeType } from '../../_internal/types'
import type {
  FormItemLabelProps,
  FormItemLabelExtraProps,
  FormItemProps,
  FormProps,
  RequiredMark,
  ValidateStatus,
} from '../props'
import { isRequired } from '../../_internal/utils/form_schema'

export function useFormClass(
  props: FormProps,
  contextSize: SizeType,
  requiredMark: RequiredMark | undefined
) {
  const { layout, size = contextSize, className } = props

  const name = usePrefixCls('form')

  return useMemo(() => {
    return cls(name, {
      [`${name}--${layout}`]: layout,
      [`${name}--hide-required-mark`]: requiredMark === false,
      [`${name}--${size}`]: size,
      [className!]: className,
    })
  }, [className, layout, name, requiredMark, size])
}

export function useFormItemClass(
  props: FormItemProps,
  validateStatus: ValidateStatus,
  prefixCls: string
) {
  const { hidden, className } = props

  return useMemo(() => {
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
  }, [className, hidden, prefixCls, validateStatus])
}

export default function useFormItemLabelClass(
  mergedProps: FormItemLabelProps & FormContextState & FormItemLabelExtraProps
) {
  const { prefixCls, vertical, required, rule, colon, labelAlign, labelCol, requiredMark } =
    mergedProps

  const isRequiredItem = useMemo(() => required ?? isRequired(rule), [required, rule])

  const colCls = useMemo(() => {
    const baseClassName = `${prefixCls}__label`
    return cls(baseClassName, {
      [`${baseClassName}--${labelAlign}`]: labelAlign,
      [`${baseClassName}--${colon}`]: colon,
      [labelCol?.className!]: labelCol?.className,
    })
  }, [prefixCls, labelAlign, colon, labelCol?.className])

  const labelCls = useMemo(() => {
    return cls(prefixCls, {
      [`${prefixCls}--required`]: isRequiredItem,
      [`${prefixCls}--required-optional`]: requiredMark === 'optional',
      [`${prefixCls}--has-colon`]: colon && !vertical,
    })
  }, [prefixCls, isRequiredItem, requiredMark, colon, vertical])

  return [colCls, labelCls] as const
}

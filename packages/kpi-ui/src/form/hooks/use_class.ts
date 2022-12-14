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
} from '../props'

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

export function useFormItemClass(props: FormItemProps, prefixCls: string) {
  const { hidden, className } = props

  return useMemo(() => {
    return cls(prefixCls, {
      [`${prefixCls}--hidden`]: hidden,
      [className!]: !!className,
    })
  }, [className, hidden, prefixCls])
}

export default function useFormItemLabelClass(
  mergedProps: FormItemLabelProps & FormContextState & FormItemLabelExtraProps
) {
  const { prefixCls, vertical, required, colon, labelAlign, labelCol, requiredMark } = mergedProps

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
      [`${prefixCls}--required`]: required,
      [`${prefixCls}--required-optional`]: requiredMark === 'optional',
      [`${prefixCls}--has-colon`]: colon && !vertical,
    })
  }, [prefixCls, required, requiredMark, colon, vertical])

  return [colCls, labelCls] as const
}

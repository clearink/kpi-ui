import { fallback } from '@kpi-ui/utils'
import cls from 'classnames'
import { DisabledContext, SizeContext } from '../../_shared/context'

import type { ButtonProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ButtonProps) {
  const { className, theme, variant, block, shape, ghost, loading } = props

  const size = fallback(props.size, SizeContext.useState())

  const disabled = fallback(props.disabled, DisabledContext.useState())

  return cls(
    prefixCls,
    {
      [`${prefixCls}--theme-${theme}`]: theme && theme !== 'primary',
      [`${prefixCls}--variant-${variant}`]: variant && variant !== 'default',
      [`${prefixCls}--shape-${shape}`]: shape && shape !== 'default',
      [`${prefixCls}--size-${size}`]: size && size !== 'middle',
      [`${prefixCls}--loading`]: loading,
      [`${prefixCls}--block`]: block,
      [`${prefixCls}--ghost`]: ghost,
      [`${prefixCls}--disabled`]: disabled,
    },
    className
  )
}

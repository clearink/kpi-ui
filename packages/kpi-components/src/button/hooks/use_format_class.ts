import { pickWithFallback } from '@kpi-ui/utils'
import cls from 'classnames'
import { DisabledContext, SizeContext } from '../../_shared/context'

import type { ButtonProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ButtonProps) {
  const { className, theme, variant, block, shape, ghost, loading } = props

  const { size, disabled } = pickWithFallback(
    props,
    {
      size: SizeContext.useState(),
      disabled: DisabledContext.useState(),
    },
    ['size', 'disabled']
  )

  return cls(prefixCls, {
    [`${prefixCls}--theme-${theme}`]: theme,
    [`${prefixCls}--variant-${variant}`]: variant,
    [`${prefixCls}--shape-${shape}`]: shape,
    [`${prefixCls}--size-${size}`]: size,
    [`${prefixCls}--loading`]: loading,
    [`${prefixCls}--block`]: block,
    [`${prefixCls}--ghost`]: ghost,
    [`${prefixCls}--disabled`]: disabled,
    [className!]: className,
  })
}

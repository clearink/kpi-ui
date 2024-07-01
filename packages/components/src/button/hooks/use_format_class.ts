import { cls } from '@kpi-ui/utils'

import type { ButtonProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ButtonProps) {
  const {
    size,
    disabled,
    theme,
    variant,
    block,
    shape,
    ghost,
    loading,
    className,
    classNames = {},
  } = props

  return {
    root: cls(
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
      className,
      classNames.root,
    ),
    icon: cls(`${prefixCls}__icon`, classNames.icon),
    text: cls(`${prefixCls}__text`, classNames.text),
  }
}

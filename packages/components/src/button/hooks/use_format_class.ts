import { cls } from '@kpi-ui/utils'

import type { ButtonProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ButtonProps) {
  const {
    block,
    className,
    classNames = {},
    disabled,
    ghost,
    loading,
    shape,
    size,
    theme,
    variant,
  } = props

  return {
    icon: cls(`${prefixCls}__icon`, classNames.icon),
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--block`]: block,
        [`${prefixCls}--disabled`]: disabled,
        [`${prefixCls}--ghost`]: ghost,
        [`${prefixCls}--loading`]: loading,
        [`${prefixCls}--shape-${shape}`]: shape && shape !== 'default',
        [`${prefixCls}--size-${size}`]: size && size !== 'middle',
        [`${prefixCls}--theme-${theme}`]: theme && theme !== 'primary',
        [`${prefixCls}--variant-${variant}`]: variant && variant !== 'default',
      },
      className,
      classNames.root,
    ),
    text: cls(`${prefixCls}__text`, classNames.text),
  }
}

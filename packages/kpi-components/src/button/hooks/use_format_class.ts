import cls from 'classnames'
import { ButtonProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: ButtonProps,
  fallbacks: Pick<ButtonProps, 'size'>
) {
  const { className, type, block, danger, shape, ghost, loading } = props
  const { size } = fallbacks

  return cls(prefixCls, {
    [`${prefixCls}--${type}`]: type,
    [`${prefixCls}--block`]: block,
    [`${prefixCls}--danger`]: danger,
    [`${prefixCls}--circle`]: shape === 'circle',
    [`${prefixCls}--round`]: shape === 'round',
    [`${prefixCls}--lg`]: size === 'large',
    [`${prefixCls}--sm`]: size === 'small',
    [`${prefixCls}--ghost`]: ghost,
    [`${prefixCls}--loading`]: loading,
    [className!]: className,
  })
}

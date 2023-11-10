import cls from 'classnames'
import { ButtonProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ButtonProps) {
  const { className, type, block, danger, shape, size, ghost, loading } = props

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

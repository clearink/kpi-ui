import cls from 'classnames'
import { isUndefined } from '@kpi-ui/utils'
import { DividerProps } from '../props'

export default function useFormatClass(prefixCls: string, props: DividerProps) {
  const { type, dashed, orientation, children, plain, className, orientationMargin } = props

  return cls(prefixCls, {
    [`${prefixCls}--${type}`]: type,
    [`${prefixCls}--dashed`]: dashed,
    [`${prefixCls}--plain`]: plain,
    [`${prefixCls}--with-text`]: children,
    [`${prefixCls}--text-${orientation}`]: orientation,
    [`${prefixCls}--custom-margin`]:
      (orientation === 'left' || orientation === 'right') && !isUndefined(orientationMargin),
    [className!]: className,
  })
}

import cls from 'classnames'
import { isUndefined } from '@kpi-ui/utils'
import { DividerProps } from '../props'

export default function useClass(name: string, props: DividerProps) {
  const { type, dashed, orientation, children, plain, className, orientationMargin } = props

  // 自定义边距
  const customMargin =
    (orientation === 'left' || orientation === 'right') && !isUndefined(orientationMargin)

  return cls(name, {
    [`${name}--${type}`]: type,
    [`${name}--dashed`]: dashed,
    [`${name}--plain`]: plain,
    [`${name}--with-text`]: children,
    [`${name}--text-${orientation}`]: orientation,
    [`${name}--custom-margin`]: customMargin,
    [className!]: className,
  })
}

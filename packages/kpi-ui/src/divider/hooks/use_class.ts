import { useMemo } from 'react'
import cls from 'classnames'
import { DividerProps } from '../props'

export default function useClass(name: string, props: DividerProps) {
  const { type, dashed, orientation, children, plain, className, orientationMargin } = props

  // 自定义边距
  const customMargin = useMemo(
    () => ['left', 'right'].includes(orientation) && orientationMargin !== undefined,
    [orientation, orientationMargin]
  )
  return useMemo(() => {
    return cls(name, {
      [`${name}--${type}`]: type,
      [`${name}--dashed`]: dashed,
      [`${name}--plain`]: plain,
      [`${name}--with-text`]: children,
      [`${name}--text-${orientation}`]: orientation,
      [`${name}--custom-margin`]: customMargin,
      [className!]: className,
    })
  }, [name, className, type, dashed, children, customMargin, plain, orientation])
}

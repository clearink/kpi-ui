import { DividerProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'

export default function useDividerClass(name: string, props: DividerProps) {
  const { type, dashed, orientation, children, plain, className, orientationMargin } = props

  // 自定义边距
  const customMargin = useMemo(() => {
    return ['left', 'right'].includes(orientation) && orientationMargin !== undefined
  }, [orientation, orientationMargin])
  return useMemo(() => {
    return cls(
      name,
      {
        [`${name}--${type}`]: type,
        [`${name}--dashed`]: dashed,
        [`${name}--plain`]: plain,
        [`${name}--with-text`]: children,
        [`${name}--text-${orientation}`]: orientation,
        [`${name}--custom-margin`]: customMargin,
      },
      className
    )
  }, [name, type, dashed, children, customMargin, plain, orientation, className])
}

import { useMemo } from 'react'
import cls from 'classnames'
import { RowProps } from '../props'

export default function useRowClass(name: string, props: RowProps) {
  const { className, justify, align } = props
  return useMemo(
    () =>
      cls(name, {
        [`${name}--${justify}`]: justify,
        [`${name}--${align}`]: align,
        [className!]: !!className,
      }),
    [name, className, justify, align]
  )
}

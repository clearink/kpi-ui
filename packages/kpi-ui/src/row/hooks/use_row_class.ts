import { useMemo } from 'react'
import cls from 'classnames'
import { RowProps } from '../props'

export default function useRowClass(name: string, props: RowProps) {
  const { className, justify, align } = props
  return useMemo(
    () =>
      cls(name, className, {
        [`${name}--${justify}`]: justify,
        [`${name}--${align}`]: align,
      }),
    [name, className, justify, align]
  )
}

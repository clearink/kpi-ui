import cls from 'classnames'
import { RowProps } from '../props'

export default function useFormatClass(name: string, props: RowProps) {
  const { className, justify, align, wrap } = props

  return cls(name, {
    [`${name}--${justify}`]: justify,
    [`${name}--${align}`]: align,
    [`${name}--wrap`]: wrap,
    [className!]: className,
  })
}

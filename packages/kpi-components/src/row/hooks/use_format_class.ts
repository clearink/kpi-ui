import cls from 'classnames'
import { RowProps } from '../props'

export default function useFormatClass(name: string, props: RowProps) {
  const { className, justify, align } = props

  return cls(name, {
    [`${name}--${justify}`]: justify,
    [`${name}--${align}`]: align,
    [className!]: className,
  })
}

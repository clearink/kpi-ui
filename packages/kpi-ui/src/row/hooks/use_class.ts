import cls from 'classnames'
import { RowProps } from '../props'

export default function useClass(name: string, props: RowProps) {
  const { className, justify, align } = props
  return cls(name, {
    [`${name}--${justify}`]: justify,
    [`${name}--${align}`]: align,
    [className!]: className,
  })
}

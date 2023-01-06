import { useMemo } from 'react'
import cls from 'classnames'
import { SpaceProps } from '../props'

export default function useClass(name: string, props: SpaceProps) {
  const { className, direction, align: $align, wrap } = props

  const align = useMemo(() => {
    const useDefault = direction === 'horizontal' && $align === undefined
    return useDefault ? 'center' : $align
  }, [$align, direction])

  return cls(name, {
    [`${name}--${direction}`]: direction,
    [`${name}--align-${align}`]: align,
    [`${name}--wrap`]: wrap,
    [className!]: className,
  })
}

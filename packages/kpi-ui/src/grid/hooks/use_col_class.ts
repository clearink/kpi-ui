import { useMemo } from 'react'
import cls from 'classnames'
import { ColProps } from '../props'

export default function useColClass(name: string, props: ColProps) {
  const { span } = props
  return useMemo(
    () =>
      cls(name, {
        [`${name}-${span}`]: true,
      }),
    [name, span]
  )
}

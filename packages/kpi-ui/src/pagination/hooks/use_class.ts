import { useMemo } from 'react'
import cls from 'classnames'
import { PaginationProps } from '../props'

export default function useClass(name: string, props: PaginationProps) {
  const { className } = props
  return useMemo(
    () =>
      cls(name, {
        [`${className!}`]: !!className,
      }),
    [name, className]
  )
}

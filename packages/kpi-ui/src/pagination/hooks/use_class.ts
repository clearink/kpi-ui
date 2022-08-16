import { useMemo } from 'react'
import cls from 'classnames'
import { PaginationProps } from '../props'
import { usePrefix } from '../../_hooks'

export default function useClass(props: PaginationProps) {
  const { className } = props
  const name = usePrefix('pagination')
  return useMemo(
    () =>
      cls(name, {
        [`${className!}`]: !!className,
      }),
    [name, className]
  )
}

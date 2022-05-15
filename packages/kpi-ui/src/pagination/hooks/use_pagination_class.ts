import { PaginationProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'

export default function usePaginationProps(name: string, props: PaginationProps) {
  const {} = props
  return useMemo(() => {
    return cls(name, {})
  }, [name])
}

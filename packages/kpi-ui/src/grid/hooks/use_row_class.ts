import { RowProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'

export default function useRowClass(name: string, props: RowProps) {
  const {} = props

  return useMemo(() => {
    return cls(name, {})
  }, [name])
}

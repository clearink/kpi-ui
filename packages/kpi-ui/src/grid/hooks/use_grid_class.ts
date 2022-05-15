import { GridProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'

export default function useGridClass(name: string, props: GridProps) {
  const {} = props

  return useMemo(() => {
    return cls(name, {})
  }, [name])
}

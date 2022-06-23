import { useMemo } from 'react'
import cls from 'classnames'
import { ColProps } from '../props'

export default function useColClass(name: string, props: ColProps) {
  return useMemo(() => {
    return cls(name, {})
  }, [name])
}

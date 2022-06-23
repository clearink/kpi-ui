import { BreadcrumbProps } from '../props'
import { useMemo } from 'react'
import cls from 'classnames'

export default function useBreadcrumbClass(name: string, props: BreadcrumbProps) {
  return useMemo(() => {
    return cls(name, {})
  }, [name])
}

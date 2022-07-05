import { useMemo } from 'react'
import cls from 'classnames'
// import { BreadcrumbProps } from '../props';

export default function useBreadcrumbClass(name: string) {
  return useMemo(() => cls(name, {}), [name])
}

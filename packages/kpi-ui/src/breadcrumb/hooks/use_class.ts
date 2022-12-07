import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefix } from '@hooks'
// import { BreadcrumbProps } from '../props';

export default function useClass() {
  const name = usePrefix('breadcrumb')
  return useMemo(() => cls(name, {}), [name])
}

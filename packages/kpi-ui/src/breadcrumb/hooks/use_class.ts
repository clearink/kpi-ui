import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'
// import { BreadcrumbProps } from '../props';

export default function useClass() {
  const name = usePrefixCls('breadcrumb')
  return useMemo(() => cls(name, {}), [name])
}

import cls from 'classnames'
import { usePrefixCls } from '../../_shared/hooks'
// import { BreadcrumbProps } from '../props';

export default function useFormatClass() {
  const name = usePrefixCls('breadcrumb')
  return cls(name, {})
}

// utils
import { cls } from '@kpi-ui/utils'
import { usePrefixCls } from '../../_shared/hooks'
// types
// import { BreadcrumbProps } from '../props';

export default function useFormatClass() {
  const prefixCls = usePrefixCls('breadcrumb')
  return cls(prefixCls)
}

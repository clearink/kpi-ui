import { usePrefixCls } from '_shared/hooks'
import { cls } from '@kpi-ui/utils'

// import { BreadcrumbProps } from '../props';

export default function useFormatClass() {
  const prefixCls = usePrefixCls('breadcrumb')
  return cls(prefixCls)
}

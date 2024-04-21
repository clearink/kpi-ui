import { cls } from '@kpi-ui/utils'
import { usePrefixCls } from '../../_shared/hooks'
// types
import type { BackTopProps } from '../props'

export default function useFormatClass(props: BackTopProps) {
  const { className } = props
  const prefixCls = usePrefixCls('back-top')
  return cls(prefixCls, className)
}

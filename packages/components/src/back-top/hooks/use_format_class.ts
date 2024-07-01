import { usePrefixCls } from '_shared/hooks'
import { cls } from '@kpi-ui/utils'

import type { BackTopProps } from '../props'

export default function useFormatClass(props: BackTopProps) {
  const { className } = props
  const prefixCls = usePrefixCls('back-top')
  return cls(prefixCls, className)
}

import { cls } from '@kpi-ui/utils'

import type { PaginationProps } from '../props'

export default function useFormatClass(prefixCls: string, props: PaginationProps) {
  const { className } = props
  return cls(prefixCls, className)
}

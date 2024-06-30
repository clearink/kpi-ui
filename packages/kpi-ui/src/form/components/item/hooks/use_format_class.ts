import { cls } from '@kpi-ui/utils'
// types
import type { FormItemProps } from '../props'

export default function useFormatClass(prefixCls: string, props: FormItemProps) {
  const { hidden, className } = props

  return cls(prefixCls, hidden && `${prefixCls}--hidden`, className)
}

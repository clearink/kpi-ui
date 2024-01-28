// utils
import { cls } from '@kpi-ui/utils'
// types
import type { BadgeProps } from '../props'

export default function useFormatClass(prefixCls: string, props: BadgeProps) {
  const { className } = props

  return cls(prefixCls, {}, className)
}

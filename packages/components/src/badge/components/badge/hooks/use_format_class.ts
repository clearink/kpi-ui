import { cls } from '@kpi-ui/utils'

import type { BadgeProps } from '../props'

export default function useFormatClass(prefixCls: string, props: BadgeProps) {
  const { className } = props

  return {
    root: cls(prefixCls, {}, className),
    indicator: cls(`${prefixCls}__indicator`),
  }
}

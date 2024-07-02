import { cls } from '@kpi-ui/utils'

import type { BadgeProps } from '../props'

export default function useFormatClass(prefixCls: string, props: BadgeProps) {
  const { className } = props

  return {
    indicator: cls(`${prefixCls}__indicator`),
    root: cls(prefixCls, {}, className),
  }
}

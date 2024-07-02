import { cls } from '@kpi-ui/utils'

import type { TooltipProps } from '../props'

export default function useFormatClass(prefixCls: string, props: TooltipProps) {
  const { className, classNames = {} } = props

  return {
    arrow: cls(`${prefixCls}__arrow`, classNames.arrow),
    root: cls(prefixCls, className, classNames.root),
  }
}

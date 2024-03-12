// utils
import { cls } from '@kpi-ui/utils'
// types
import type { TooltipProps } from '../props'

export default function useFormatClass(prefixCls: string, props: TooltipProps) {
  const { placement, className, classNames = {} } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}-${placement}`]: placement,
      },
      className,
      classNames.root
    ),
    arrow: cls(`${prefixCls}__arrow`, classNames.arrow),
    content: cls(`${prefixCls}__content`, classNames.content),
  }
}

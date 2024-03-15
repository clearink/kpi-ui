import { cls } from '@kpi-ui/utils'
// types
import type { TooltipProps } from '../props'

export default function useFormatClass(prefixCls: string, props: TooltipProps) {
  const { placement, arrow, className, classNames = {} } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}-${placement}`]: placement,
        [`${prefixCls}-has-arrow`]: !!arrow,
      },
      className,
      classNames.root
    ),
    arrow: cls(`${prefixCls}__arrow`, classNames.arrow),
    content: cls(`${prefixCls}__content`, classNames.content),
  }
}

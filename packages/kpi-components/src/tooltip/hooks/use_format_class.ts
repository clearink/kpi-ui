// utils
import { cls } from '@kpi-ui/utils'
// types
import type { TooltipProps } from '../props'

export default function useFormatClass(prefixCls: string, props: TooltipProps) {
  const { className, classNames = {} } = props

  return {
    root: cls(prefixCls, className, classNames.root),
    arrow: cls(`${prefixCls}__arrow`, classNames.arrow),
    main: cls(`${prefixCls}__main`, classNames.main),
    title: cls(`${prefixCls}__title`, classNames.title),
    content: cls(`${prefixCls}__content`, classNames.content),
  }
}

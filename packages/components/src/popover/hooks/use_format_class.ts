import { cls } from '@kpi-ui/utils'

import type { PopoverProps } from '../props'

export default function useFormatClass(prefixCls: string, props: PopoverProps) {
  const { className, classNames = {} } = props

  return {
    root: cls(prefixCls, className, classNames.root),
    arrow: cls(`${prefixCls}__arrow`, classNames.arrow),
    title: cls(`${prefixCls}__title`, classNames.title),
    content: cls(`${prefixCls}__content`, classNames.content),
  }
}

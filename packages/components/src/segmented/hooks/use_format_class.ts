import { cls } from '@kpi-ui/utils'

import type { SegmentedProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SegmentedProps) {
  const { size, block, disabled, className, classNames = {} } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--block`]: block,
        [`${prefixCls}--disabled`]: disabled,
        [`${prefixCls}--sm`]: size === 'small',
        [`${prefixCls}--lg`]: size === 'large',
      },
      className,
      classNames.root,
    ),
    group: cls(`${prefixCls}__group`, classNames.group),
    thumb: cls(`${prefixCls}__thumb`, classNames.thumb),
  }
}

import { cls } from '@kpi-ui/utils'

import type { CollapseProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CollapseProps) {
  const { bordered, ghost, size, expandIconPosition, className, classNames } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--bordered`]: bordered && !ghost,
        [`${prefixCls}--ghost`]: ghost,
        [`${prefixCls}--icon-end`]: expandIconPosition === 'end',
        [`${prefixCls}--sm`]: size === 'small',
        [`${prefixCls}--lg`]: size === 'large',
      },
      className,
      classNames?.root,
    ),
  }
}

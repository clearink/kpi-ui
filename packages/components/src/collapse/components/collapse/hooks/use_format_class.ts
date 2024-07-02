import { cls } from '@kpi-ui/utils'

import type { CollapseProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CollapseProps) {
  const { bordered, className, classNames, expandIconPosition, ghost, size } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--bordered`]: bordered && !ghost,
        [`${prefixCls}--ghost`]: ghost,
        [`${prefixCls}--icon-end`]: expandIconPosition === 'end',
        [`${prefixCls}--lg`]: size === 'large',
        [`${prefixCls}--sm`]: size === 'small',
      },
      className,
      classNames?.root,
    ),
  }
}

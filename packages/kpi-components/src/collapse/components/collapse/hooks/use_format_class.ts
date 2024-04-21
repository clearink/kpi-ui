import { cls } from '@kpi-ui/utils'
// types
import type { CollapseProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CollapseProps) {
  const { bordered, ghost, expandIconPosition: pos, className, classNames } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--bordered`]: bordered && !ghost,
        [`${prefixCls}--ghost`]: ghost,
        [`${prefixCls}--icon-end`]: pos === 'end',
      },
      className,
      classNames?.root
    ),
  }
}

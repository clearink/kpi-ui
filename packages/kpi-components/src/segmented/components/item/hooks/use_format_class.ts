import { cls } from '@kpi-ui/utils'
// types
import type { SegmentedItemProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SegmentedItemProps) {
  const { checked, showThumb, className, classNames = {} } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--selected`]: checked && !showThumb,
      },
      className,
      classNames.root
    ),
    radio: cls(`${prefixCls}__radio`),
    label: cls(`${prefixCls}__label`, classNames.label),
  }
}

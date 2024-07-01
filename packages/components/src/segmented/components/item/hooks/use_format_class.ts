import { cls } from '@kpi-ui/utils'

import type { SegmentedItemProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SegmentedItemProps) {
  const { checked, showThumb, disabled, className, classNames = {} } = props

  return {
    root: cls(
      prefixCls,
      {
        [`${prefixCls}--selected`]: checked && !showThumb,
        [`${prefixCls}--disabled`]: disabled,
      },
      className,
      classNames.root
    ),
    radio: cls(`${prefixCls}__radio`),
    label: cls(`${prefixCls}__label`, classNames.label),
  }
}

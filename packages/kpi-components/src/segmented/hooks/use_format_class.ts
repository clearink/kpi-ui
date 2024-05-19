import { cls } from '@kpi-ui/utils'
import { useCompSize } from '../../_shared/hooks'
// types
import type { SegmentedProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SegmentedProps) {
  const { size: _size, className, classNames = {} } = props

  const size = useCompSize(_size)

  return {
    root: cls(prefixCls, {}, className, classNames.root),
    group: cls(`${prefixCls}__group`, classNames.group),
    item: cls(`${prefixCls}__item`, classNames.item),
    thumb: cls(`${prefixCls}__thumb`, classNames.thumb),
    label: cls(`${prefixCls}__label`, classNames.label),
  }
}

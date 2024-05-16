import { cls } from '@kpi-ui/utils'
// types
import type { SegmentedProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SegmentedProps) {
  const { className, classNames = {} } = props

  return {
    root: cls(prefixCls, {}, className, classNames.root),
  }
}

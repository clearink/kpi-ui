import { cls } from '@kpi-ui/utils'

import type { CheckboxGroupProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CheckboxGroupProps) {
  const { className } = props

  return cls(prefixCls, {}, className)
}

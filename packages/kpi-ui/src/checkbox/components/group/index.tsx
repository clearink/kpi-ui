import { omit } from '@kpi-ui/utils'
import { usePrefixCls } from '_shared/hooks'
import useFormatClass from './hooks/use_format_class'

import type { CheckboxGroupProps } from './props'

const excluded = ['children'] as const

function CheckboxGroup(props: CheckboxGroupProps) {
  const { children } = props

  const prefixCls = usePrefixCls('checkbox-group')

  const classes = useFormatClass(prefixCls, props)

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} className={classes}>
      <input type="checkbox" />
      <span>{children}</span>
    </div>
  )
}

export default CheckboxGroup

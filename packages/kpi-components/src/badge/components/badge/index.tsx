import { isNumber, withDefaults } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import ScrollNumber from '../scroll-number'
import useFormatClass from './hooks/use_format_class'

import type { BadgeProps } from './props'

function Badge(props: BadgeProps) {
  const { children, count, max } = props

  const prefixCls = usePrefixCls('badge')

  const classes = useFormatClass(prefixCls, props)

  return (
    <span className={classes}>
      {children}
      <sup className={`${prefixCls}__indicator`}>
        {isNumber(count) && <ScrollNumber value={count} max={max!} />}
      </sup>
    </span>
  )
}

export default withDefaults(Badge, {
  max: 99,
})

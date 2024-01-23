import { isNumber, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import ScrollNumber from '../scroll-number'
import useFormatClass from './hooks/use_format_class'

import type { BadgeProps } from './props'

export const defaultProps: Partial<BadgeProps> = {
  maxCount: 99,
}
function Badge(_props: BadgeProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, count, maxCount } = props

  const prefixCls = usePrefixCls('badge')

  const classes = useFormatClass(prefixCls, props)

  return (
    <span className={classes}>
      {children}
      <sup className={`${prefixCls}__indicator`}>
        {isNumber(count) && <ScrollNumber value={count} maxCount={maxCount!} />}
      </sup>
    </span>
  )
}

export default withDisplayName(Badge)

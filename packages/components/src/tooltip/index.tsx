import { fallback, withDisplayName } from '@kpi-ui/utils'
import { Tooltip as InternalTooltip } from '_shared/components'
import { usePrefixCls } from '_shared/hooks'

import type { TooltipProps } from './props'

import useFormatClass from './hooks/use_format_class'

function Tooltip(props: TooltipProps) {
  const { transition } = props

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-tooltip`

  const classNames = useFormatClass(prefixCls, props)

  return (
    <InternalTooltip
      {...props}
      classNames={classNames}
      transition={fallback(transition, `${rootPrefixCls}-zoom-fast`)}
    />
  )
}

export default withDisplayName(Tooltip)

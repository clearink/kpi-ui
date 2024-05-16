import { fallback, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
// comps
import InternalTooltip from '../_internal/tooltip'
// types
import type { TooltipProps } from './props'

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

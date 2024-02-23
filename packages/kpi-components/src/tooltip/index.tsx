// utils
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'

// comps
import InternalTooltip from '../_internal/tooltip'

// types
import type { TooltipProps } from './props'
import useFormatClass from './hooks/use_format_class'

const defaultProps: Partial<TooltipProps> = {}

function Tooltip(_props: TooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-tooltip`

  const classNames = useFormatClass(prefixCls, props)

  return (
    <InternalTooltip
      {...props}
      classNames={classNames}
      transitions={{
        content: `${rootPrefixCls}-slide-bottom`,
      }}
    />
  )
}

export default withDisplayName(Tooltip)

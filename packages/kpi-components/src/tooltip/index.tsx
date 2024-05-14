import { fallback, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
// comps
import InternalTooltip from '../_internal/tooltip'
// types
import type { TooltipProps } from './props'

const defaultProps: Partial<TooltipProps> = {}

function Tooltip(props: TooltipProps) {
  const { transition, style, styles: _styles } = props

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-tooltip`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  return (
    <InternalTooltip
      {...props}
      transition={fallback(transition, `${rootPrefixCls}-zoom-fast`)}
      classNames={classNames}
      styles={styles}
    />
  )
}

export default withDisplayName(Tooltip)

import { fallback, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
// comps
import Tooltip from '../tooltip'
// types
import type { PopoverProps } from './props'

const defaultProps: Partial<PopoverProps> = {}

function Popover(props: PopoverProps) {
  const { style, styles: _styles } = props

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-tooltip`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  return (
    <Tooltip
      {...props}
      classNames={classNames}
      styles={styles}
      content={
        <>
          <div className={classNames.title}>title</div>
          <div className={classNames.content}>content</div>
        </>
      }
    />
  )
}

export default withDisplayName(Popover)

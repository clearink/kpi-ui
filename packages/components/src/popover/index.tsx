import { withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'

import type { PopoverProps } from './props'

import Tooltip from '../tooltip'
import useFormatClass from './hooks/use_format_class'

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
      content={
        <>
          <div className={classNames.title}>title</div>
          <div className={classNames.content}>content</div>
        </>
      }
      styles={styles}
    />
  )
}

export default withDisplayName(Popover)

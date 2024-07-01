import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { type ForwardedRef, forwardRef } from 'react'

import useFormatClass from './hooks/use_format_class'
import type { SegmentedItemProps } from './props'

function SegmentedItem(props: SegmentedItemProps, _ref: ForwardedRef<HTMLLabelElement>) {
  const { label, value, title, checked, disabled, onChange, style, styles: _styles } = props

  const prefixCls = usePrefixCls('segmented-item')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  return (
    <label ref={_ref} className={classNames.root} style={styles.root}>
      <input
        className={classNames.radio}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={() => {
          !disabled && onChange(value)
        }}
      />
      <div className={classNames.label} style={styles.label} title={title}>
        {label}
      </div>
    </label>
  )
}

export default withDisplayName(forwardRef(SegmentedItem), 'SegmentedItem')

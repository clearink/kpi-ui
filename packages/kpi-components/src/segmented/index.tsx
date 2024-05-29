import { getElementStyle, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, useMemo, type ForwardedRef } from 'react'
import { SizeContext } from '../_shared/context'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useSegmentedStore from './hooks/use_segmented_store'
import useSegmentedValue from './hooks/use_segmented_value'
import { normalizeOptions } from './utils/helpers'
// comps
import SegmentedItem from './components/item'
import SegmentedThumb from './components/thumb'
// types
import type { SegmentedProps } from './props'
import useWatchSegmented from './hooks/use_watch_segmented'
import { reflow } from '../_shared/utils'

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, {
    size: SizeContext.useState(),
  })

  const { style, options: _options, styles: _styles, disabled } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const options = useMemo(() => normalizeOptions(_options), [_options])

  const [active, onChange] = useSegmentedValue(props, options)

  const { states, actions } = useSegmentedStore()

  const returnEarly = useWatchSegmented(active, actions)

  if (returnEarly) return null

  return (
    <div className={classNames.root} style={styles.root} ref={_ref}>
      <div ref={states.$group} className={classNames.group} style={styles.group}>
        <SegmentedThumb />
        {options.map((item, index) => (
          <SegmentedItem
            {...item}
            ref={(el) => {
              states.items.set(item.value, el)
            }}
            key={item.value}
            prefixCls={`${prefixCls}-item`}
            inTransition={states.inTransition}
            checked={active === item.value}
            disabled={disabled || item.disabled}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

export default withDisplayName(forwardRef(Segmented), 'Segmented')

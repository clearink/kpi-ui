import { useComposeRefs } from '@kpi-ui/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, useMemo, type ForwardedRef } from 'react'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useSegmentedStore from './hooks/use_segmented_store'
import { normalizeSegmentedOptions } from './utils/helpers'
// comps
import SegmentedItem from './components/item'
import SegmentedThumb from './components/thumb'
// types
import type { SegmentedProps, SegmentedRef } from './props'
import useSegmentedValue from './hooks/use_segmented_value'
import { SegmentedContext } from './_shared/context'

const defaultProps: Partial<SegmentedProps> = {}

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<SegmentedRef>) {
  const props = withDefaults(_props, defaultProps)

  const { style, options: _options, styles: _styles } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const { states, actions } = useSegmentedStore(props)

  const ref = useComposeRefs(_ref, states.$root)

  const options = useMemo(() => normalizeSegmentedOptions(_options), [_options])

  const [value, setValue] = useSegmentedValue(props)

  return (
    <div className={classNames.root} style={styles.root} ref={ref}>
      <div className={classNames.group} style={styles.group}>
        <SegmentedContext.Provider value={{}}>
          <SegmentedThumb classNames={classNames} styles={styles} />
          {options.map((item) => (
            <SegmentedItem key={item.key} classNames={classNames} styles={styles} />
          ))}
        </SegmentedContext.Provider>
      </div>
    </div>
  )
}

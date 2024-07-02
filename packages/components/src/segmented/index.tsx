import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { CSSTransition } from '_shared/components'
import { SizeContext } from '_shared/contexts'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { type ForwardedRef, forwardRef, useMemo } from 'react'

import type { SegmentedProps } from './props'

import SegmentedItem from './components/item'
import useFormatClass from './hooks/use_format_class'
import useSegmentedStore from './hooks/use_segmented_store'
import useSegmentedValue from './hooks/use_segmented_value'
import { normalizeOptions } from './utils/helpers'

const defaultProps: Partial<SegmentedProps> = {
  block: false,
}

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, {
    ...defaultProps,
    size: SizeContext.useState(),
  })

  const { disabled, options: _options, style, styles: _styles } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const options = useMemo(() => normalizeOptions(_options), [_options])

  const [active, onChange] = useSegmentedValue(props, options)

  const { actions, returnEarly, states } = useSegmentedStore(active)

  if (returnEarly) return null

  return (
    <div className={classNames.root} ref={_ref} style={styles.root}>
      <div className={classNames.group} ref={states.$group} style={styles.group}>
        {states.showThumb && (
          <CSSTransition
            appear
            key={active}
            name={`${prefixCls}-thumb-motion`}
            onEnter={actions.onThumbEnter}
            onEntered={actions.onThumbEntered}
            onEntering={actions.onThumbEntering}
            when
          >
            <div className={classNames.thumb} ref={actions.setThumb} style={styles.thumb}></div>
          </CSSTransition>
        )}
        {options.map(item => (
          <SegmentedItem
            {...item}
            checked={active === item.value}
            disabled={disabled || item.disabled}
            key={item.value}
            onChange={onChange}
            ref={(el) => {
              actions.setItem(item.value, el)
            }}
            showThumb={states.showThumb}
          />
        ))}
      </div>
    </div>
  )
}

export default withDisplayName(forwardRef(Segmented), 'Segmented') as <T>(
  props: React.RefAttributes<HTMLDivElement> & SegmentedProps<T>,
) => JSX.Element

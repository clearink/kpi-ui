import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, useMemo, type ForwardedRef } from 'react'
import { SizeContext } from '../_shared/context'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useSegmentedStore from './hooks/use_segmented_store'
import useSegmentedValue from './hooks/use_segmented_value'
import { normalizeOptions } from './utils/helpers'
// comps
import { CSSTransition } from '../_internal/transition'
import SegmentedItem from './components/item'
// types
import type { SegmentedProps } from './props'

const defaultProps: Partial<SegmentedProps> = {
  block: false,
}

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, {
    ...defaultProps,
    size: SizeContext.useState(),
  })

  const { style, options: _options, styles: _styles, disabled } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const options = useMemo(() => normalizeOptions(_options), [_options])

  const [active, onChange] = useSegmentedValue(props, options)

  const { returnEarly, states, actions } = useSegmentedStore(active)

  if (returnEarly) return null

  return (
    <div className={classNames.root} style={styles.root} ref={_ref}>
      <div ref={states.$group} className={classNames.group} style={styles.group}>
        {states.showThumb && (
          <CSSTransition
            key={active}
            when
            appear
            name={`${prefixCls}-thumb-motion`}
            onEnter={actions.onThumbEnter}
            onEntering={actions.onThumbEntering}
            onEntered={actions.onThumbEntered}
          >
            <div ref={actions.setThumb} className={classNames.thumb} style={styles.thumb}></div>
          </CSSTransition>
        )}
        {options.map((item) => (
          <SegmentedItem
            {...item}
            ref={(el) => {
              actions.setItem(item.value, el)
            }}
            key={item.value}
            showThumb={states.showThumb}
            checked={active === item.value}
            disabled={disabled || item.disabled}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

export default withDisplayName(forwardRef(Segmented), 'Segmented') as <T>(
  props: SegmentedProps<T> & React.RefAttributes<HTMLDivElement>
) => JSX.Element

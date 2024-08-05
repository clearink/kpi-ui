import { CSSTransition } from '@comps/_shared/components'
import { SizeContext } from '@comps/_shared/contexts'
import { usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { type ForwardedRef, forwardRef, useMemo } from 'react'

import SegmentedItem from './components/item'
import useFormatClass from './hooks/use_format_class'
import useSegmentedStore from './hooks/use_segmented_store'
import useSegmentedValue from './hooks/use_segmented_value'
import { type SegmentedProps, defaultSegmentedProps } from './props'
import { normalizeOptions } from './utils/helpers'

function _Segmented(_props: SegmentedProps, _ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, {
    ...defaultSegmentedProps,
    size: SizeContext.useState(),
  })

  const { disabled, options: _options } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(props)

  const options = useMemo(() => normalizeOptions(_options), [_options])

  const [active, onChange] = useSegmentedValue(props, options)

  const { actions, returnEarly, states } = useSegmentedStore(active)

  if (returnEarly) return null

  return (
    <div ref={_ref} className={classNames.root} style={styles.root}>
      <div ref={states.$group} className={classNames.group} style={styles.group}>
        {states.showThumb && (
          <CSSTransition
            key={active}
            appear
            when
            name={`${prefixCls}-thumb-motion`}
            onEnter={actions.handleThumbEnter}
            onEntered={actions.handleThumbEntered}
            onEntering={actions.handleThumbEntering}
          >
            <div ref={actions.setThumb} className={classNames.thumb} style={styles.thumb} />
          </CSSTransition>
        )}
        {options.map(item => (
          <SegmentedItem
            {...item}
            key={item.value}
            ref={(el) => {
              actions.setItem(item.value, el)
            }}
            checked={active === item.value}
            disabled={disabled || item.disabled}
            showThumb={states.showThumb}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

attachDisplayName(_Segmented)

const Segmented = forwardRef(_Segmented) as <T>(
  props: React.RefAttributes<HTMLDivElement> & SegmentedProps<T>,
) => JSX.Element

export default Segmented

import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
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

function Segmented(_props: SegmentedProps, _ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, {
    size: SizeContext.useState(),
  })

  const { style, options: _options, styles: _styles, disabled } = props

  const prefixCls = usePrefixCls('segmented')

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const { states, actions } = useSegmentedStore(props)

  const options = useMemo(() => normalizeOptions(_options), [_options])

  const [value, setValue] = useSegmentedValue(props, options)

  // 1. 记录segmented-item的dom信息
  // 2. 当value改变时在thumb组件中切换动画

  return (
    <div className={classNames.root} style={styles.root} ref={_ref}>
      <div className={classNames.group} style={styles.group}>
        <SegmentedThumb className={classNames.thumb} style={styles.thumb} active={value} />
        {options.map((item) => (
          <SegmentedItem
            {...item}
            ref={(el) => actions.setItem(el, item)}
            key={item.value}
            prefixCls={`${prefixCls}-item`}
            checked={value === item.value}
            disabled={disabled || item.disabled}
            onChange={setValue}
          />
        ))}
      </div>
    </div>
  )
}

// <SegmentedItem
//   {...option}
//   ref={(el) => actions.setItem(el, option)}
//   key={option.value}
//   prefixCls={prefixCls}
//   classNames={classNames}
//   styles={styles}
//   checked={value === option.value}
//   disabled={disabled || option.disabled}
//   onChange={setValue}
// />
export default withDisplayName(forwardRef(Segmented), 'Segmented')

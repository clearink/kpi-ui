// utils
import { useControllableState, useEvent } from '@kpi-ui/hooks'
import { isArray, isNullish, toArray, withDefaults } from '@kpi-ui/utils'
import { forwardRef, useEffect, useMemo } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import { toSemanticStyles } from '../../utils/format_styles'

// comps
import CollapseItem from '../item'
// types
import type { ForwardedRef, Ref } from 'react'
import type { CollapseContextState } from '../../_shared/context'
import type { ExpandedKey } from '../../props'
import type { CollapseProps } from './props'

function Collapse(props: CollapseProps, ref: ForwardedRef<HTMLDivElement>) {
  const {
    items,
    children,
    expandedKeys: _expandedKeys,
    defaultExpandedKeys,
    accordion,
    arrowPlacement,
    onChange,
  } = props

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const styles = toSemanticStyles(props.style, props.styles)

  const [expandedKeys, setExpandedKeys] = useControllableState({
    value: isNullish(_expandedKeys) ? undefined : toArray(_expandedKeys),
    defaultValue: isNullish(defaultExpandedKeys) ? undefined : toArray(defaultExpandedKeys),
    shouldUpdate: (prev, next) => {
      return prev.length !== next.length || prev.some((key, index) => key !== next[index])
    },
  })

  const onItemExpand = useEvent((key: ExpandedKey) => {
    let keys = expandedKeys.concat()

    const index = keys.indexOf(key)

    const isExpanded = index > -1

    if (accordion) keys = isExpanded ? [] : [key]
    else if (isExpanded) keys.splice(index, 1)
    else keys.push(key)

    setExpandedKeys(keys)
    onChange && onChange(key, keys)
  })

  useEffect(() => {
    const keys = toArray(expandedKeys)
    if (accordion && keys.length > 1) onItemExpand(keys[0])
  }, [accordion, expandedKeys, onItemExpand])

  // TODO 检测 accordion 属性 更改 expandedKeys 为单一值

  const collapseContext = useMemo<CollapseContextState>(() => {
    return {
      accordion,
      arrowPlacement,
      onItemExpand,
      expandedKeys: toArray(expandedKeys),
    }
  }, [accordion, arrowPlacement, expandedKeys, onItemExpand])

  console.log('render')
  return (
    <div
      ref={ref}
      className={classNames}
      style={styles.root}
      role={accordion ? 'tablist' : undefined}
    >
      <CollapseContext.Provider value={collapseContext}>
        {isArray(items)
          ? items.map((item) => <CollapseItem {...item} key={item.name} />)
          : children}
      </CollapseContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Collapse), {
  bordered: true,
}) as <K extends ExpandedKey>(props: CollapseProps & { ref?: Ref<HTMLDivElement> }) => JSX.Element

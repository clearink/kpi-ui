// utils
import { useControllableState, useEvent } from '@kpi-ui/hooks'
import { hasItem, removeItem, toArray, withDefaults } from '@kpi-ui/utils'
import { forwardRef, useMemo } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import useFormatChildren from './hooks/use_format_children'
import useFormatClass from './hooks/use_format_class'
// types
import type { ForwardedRef, Ref } from 'react'
import type { CollapseContextState } from '../../_shared/context'
import type { ExpandedKey } from '../../props'
import type { CollapseProps } from './props'

function Collapse(props: CollapseProps, ref: ForwardedRef<HTMLDivElement>) {
  const { accordion, arrowPlacement, onChange } = props

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const children = useFormatChildren(props)

  const [expandedKeys, setExpandedKeys] = useControllableState({
    value: props.expandedKeys,
    defaultValue: props.defaultExpandedKeys,
  })

  const onItemExpand = useEvent((key: ExpandedKey) => {
    let keys = toArray(expandedKeys).concat()

    if (hasItem(keys, key)) removeItem(keys, key)
    else if (accordion) keys = [key]
    else keys.push(key)

    setExpandedKeys(keys)
    onChange && onChange(key, keys)
  })

  // TODO 检测 accordion 属性 更改 expandedKeys 为单一值

  const collapseContext = useMemo<CollapseContextState>(() => {
    return {
      accordion,
      arrowPlacement,
      onItemExpand,
      expandedKeys: toArray(expandedKeys),
    }
  }, [accordion, arrowPlacement, expandedKeys, onItemExpand])

  return (
    <div ref={ref} className={classNames}>
      <CollapseContext.Provider value={collapseContext}>{children}</CollapseContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Collapse), {
  bordered: true,
}) as <K extends ExpandedKey>(props: CollapseProps & { ref?: Ref<HTMLDivElement> }) => JSX.Element

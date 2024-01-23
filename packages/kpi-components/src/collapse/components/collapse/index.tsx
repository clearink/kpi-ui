// utils
import { useControllableState, useEvent } from '@kpi-ui/hooks'
import { isArray, isUndefined, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, useMemo } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { CollapseContext } from '../../_shared/context'
import getSemanticStyles from '../../utils/semantic_styles'
import useFormatClass from './hooks/use_format_class'
import getExpandedNames from './utils/get_expanded_names'
// comps
import CollapseItem from '../item'
// types
import type { ForwardedRef, Ref } from 'react'
import type { CollapseContextState } from '../../_shared/context'
import type { ExpandedName } from '../../props'
import type { CollapseProps } from './props'

export const defaultProps: Partial<CollapseProps> = {
  bordered: true,
  collapsible: 'header',
  expandIconPosition: 'start',
}

function Collapse(_props: CollapseProps, ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, defaultProps)

  const {
    items,
    children,
    expandedNames: _names,
    defaultExpandedNames: _default,
    accordion,
    expandIconPosition,
    keepMounted,
    unmountOnExit,
    expandIcon,
    collapsible,
    onChange,
  } = props

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const styles = getSemanticStyles(props.style, props.styles)

  const [expandedNames, setExpandedNames] = useControllableState({
    value: isUndefined(_names) ? undefined : getExpandedNames(_names, accordion),
    defaultValue: () => getExpandedNames(_default, accordion),
  })

  const onItemClick = useEvent((name: ExpandedName) => {
    let names = expandedNames.concat()

    const index = names.indexOf(name)

    const isExpanded = index > -1

    if (accordion) names = isExpanded ? [] : [name]
    else if (isExpanded) names.splice(index, 1)
    else names.push(name)

    setExpandedNames(names)

    onChange && onChange(name, names)
  })

  const collapseContext = useMemo<CollapseContextState>(
    () => ({
      accordion,
      expandIconPosition,
      onItemClick,
      expandedNames,
      keepMounted,
      unmountOnExit,
      expandIcon,
      collapsible,
    }),
    [
      accordion,
      expandIcon,
      expandIconPosition,
      expandedNames,
      keepMounted,
      onItemClick,
      unmountOnExit,
      collapsible,
    ]
  )

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

export default withDisplayName(forwardRef(Collapse)) as <K extends ExpandedName>(
  props: CollapseProps<K> & { ref?: Ref<HTMLDivElement> }
) => JSX.Element

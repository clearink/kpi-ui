import { isArray, isUndefined, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useControllableState, useEvent, usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { type ForwardedRef, forwardRef, useMemo } from 'react'

import type { CollapseContextState } from '../../_shared/context'
import type { ExpandedName } from '../../props'
import type { CollapseProps } from './props'

import { CollapseContext } from '../../_shared/context'
import CollapseItem from '../item'
import useFormatClass from './hooks/use_format_class'
import getExpandedNames from './utils/get_expanded_names'

const defaultProps: Partial<CollapseProps> = {
  bordered: true,
  collapsible: 'header',
  expandIconPosition: 'start',
}

function Collapse(_props: CollapseProps, ref: ForwardedRef<HTMLDivElement>) {
  const props = withDefaults(_props, defaultProps)

  const {
    accordion,
    children,
    collapsible,
    defaultExpandedNames: _default,
    disabled,
    expandIcon,
    expandIconPosition,
    expandedNames: _names,
    items,
    keepMounted,
    onChange,
    style,
    styles: _styles,
    unmountOnExit,
  } = props

  const styles = useSemanticStyles(style, _styles)

  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const [expandedNames, setExpandedNames] = useControllableState({
    defaultValue: () => getExpandedNames(_default, accordion),
    value: isUndefined(_names) ? undefined : getExpandedNames(_names, accordion),
  })

  const onItemClick = useEvent((name: ExpandedName) => {
    let names = expandedNames.concat()

    const index = names.indexOf(name)

    const isExpanded = index > -1

    if (accordion) names = isExpanded ? [] : [name]
    else if (isExpanded) names.splice(index, 1)
    else names.push(name)

    setExpandedNames(names)

    onChange?.(name, names)
  })

  const collapseContext = useMemo<CollapseContextState>(
    () => ({
      accordion,
      collapsible,
      disabled,
      expandIcon,
      expandIconPosition,
      expandedNames,
      keepMounted,
      onItemClick,
      unmountOnExit,
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
      disabled,
    ],
  )

  return (
    <div
      className={classNames.root}
      ref={ref}
      role={accordion ? 'tablist' : undefined}
      style={styles.root}
    >
      <CollapseContext.Provider value={collapseContext}>
        {isArray(items)
          ? items.map(item => <CollapseItem {...item} key={item.name} />)
          : children}
      </CollapseContext.Provider>
    </div>
  )
}

export default withDisplayName(forwardRef(Collapse), 'Collapse') as <K extends ExpandedName>(
  props: CollapseProps<K> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

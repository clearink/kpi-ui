// utils
import { useControllableState } from '@kpi-ui/hooks'
import { toArray, withDefaults } from '@kpi-ui/utils'
import { forwardRef, useMemo } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useConvertChildren from './hooks/use_convert_children'
// types
import type { ExpandedKey } from '../../props'
import type { CollapseProps } from './props'
import type { ForwardedRef, Ref } from 'react'
import { CollapseContext } from '../../_shared/context'

function Collapse(props: CollapseProps, ref: ForwardedRef<HTMLDivElement>) {
  const prefixCls = usePrefixCls('collapse')

  const classNames = useFormatClass(prefixCls, props)

  const children = useConvertChildren(props)

  const [expandedKeys, setExpandedKeys] = useControllableState({
    value: toArray(props.expandedKeys),
    defaultValue: toArray(props.defaultExpandedKeys),
    onChange: () => {},
  })

  const collapseContext = useMemo(() => {
    return {
      expandedKeys,
    }
  }, [expandedKeys])

  return (
    <div ref={ref} className={classNames}>
      <CollapseContext.Provider value={collapseContext}>{children}</CollapseContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Collapse), {
  bordered: true,
}) as <K extends ExpandedKey>(props: CollapseProps & { ref?: Ref<HTMLDivElement> }) => JSX.Element

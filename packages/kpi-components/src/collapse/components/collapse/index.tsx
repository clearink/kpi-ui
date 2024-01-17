// utils
import { withDefaults } from '@kpi-ui/utils'
import useFormatItems from './hooks/use_format_items'

// comps
import CollapsePanel from '../panel'

// types
import type { CollapseProps, ExpandedKey } from './props'
import { usePrefixCls } from '../../../_shared/hooks'

function Collapse<K extends ExpandedKey>(props: CollapseProps<K>) {
  const prefixCls = usePrefixCls('collapse')

  const items = props.items.map((item) => {
    return <CollapsePanel {...item} name={item.key} key={item.key} />
  })

  return <div>{items}</div>
}

export default withDefaults(Collapse) as <K extends ExpandedKey>(
  props: CollapseProps<K>
) => JSX.Element

import { withDefaults } from '@kpi-ui/utils'
import CollapsePanel from '../panel'

import type { ExpandedKey, CollapseProps } from './props'

function Collapse<K extends ExpandedKey>(props: CollapseProps<K>) {
  return <div>123</div>
}

export default withDefaults(Collapse) as <K extends ExpandedKey>(
  props: CollapseProps<K>
) => JSX.Element

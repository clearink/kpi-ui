import { useConstant } from '@kpi-ui/hooks'
import { LayoutContext } from '../_shared/context'
import LayoutTransitionStore from './store'

import type { LayoutGroupProps } from './props'

function LayoutGroup(props: LayoutGroupProps) {
  const { children } = props

  const layoutContext = useConstant(() => new LayoutTransitionStore())

  return <LayoutContext.Provider value={layoutContext}>{children}</LayoutContext.Provider>
}

export default LayoutGroup

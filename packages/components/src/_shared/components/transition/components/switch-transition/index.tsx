import { useWatchValue } from '_shared/hooks'
import { withDisplayName } from '@kpi-ui/utils'

import { isElementEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'
import type { SwitchTransitionProps } from './props'

// 转场动画
function SwitchTransition<E extends HTMLElement = HTMLElement>(props: SwitchTransitionProps<E>) {
  const { children, mode } = props

  const { states, actions } = useTransitionStore(props)

  const shouldTransition = !isElementEqual(states.current, children)

  let returnEarly = false

  useWatchValue(shouldTransition, () => {
    if (!shouldTransition) return

    if (mode === 'out-in') actions.runOutInSwitch()
    else if (mode === 'in-out') actions.runInOutSwitch()
    else actions.runDefaultSwitch()

    returnEarly = true

    actions.forceUpdate()
  })

  return returnEarly ? null : <>{actions.renderNodes()}</>
}

export default withDisplayName(SwitchTransition) as <E extends HTMLElement>(
  props: SwitchTransitionProps<E>,
) => JSX.Element

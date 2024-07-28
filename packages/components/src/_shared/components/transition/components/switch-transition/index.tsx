import { useWatchValue } from '@comps/_shared/hooks'
import { attachDisplayName } from '@comps/_shared/utils'

import type { SwitchTransitionProps } from './props'

import { isElementEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

// 转场动画
function SwitchTransition<E extends HTMLElement = HTMLElement>(props: SwitchTransitionProps<E>) {
  const { children, mode } = props

  const { actions, states } = useTransitionStore(props)

  const shouldTransition = !isElementEqual(states.current, children)

  const returnEarly = useWatchValue(shouldTransition, () => {
    if (!shouldTransition) return false

    if (mode === 'out-in') actions.runOutInSwitch()
    else if (mode === 'in-out') actions.runInOutSwitch()
    else actions.runDefaultSwitch()

    return true
  })

  return returnEarly ? null : <>{actions.renderNodes()}</>
}

attachDisplayName(SwitchTransition)

export default SwitchTransition

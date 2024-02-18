// utils
import { useDerivedState } from '@kpi-ui/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { isElementEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'
// types
import type { SwitchTransitionProps } from './props'

// 转场动画
function SwitchTransition<E extends HTMLElement = HTMLElement>(props: SwitchTransitionProps<E>) {
  const { children, mode } = props

  const store = useTransitionStore(props)

  store.setTransitionProps(props)

  const shouldTransition = !isElementEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    if (mode === 'out-in') store.runOutInSwitch()
    else if (mode === 'in-out') store.runInOutSwitch()
    else store.runDefaultSwitch()

    store.forceUpdate()
  })

  return <>{store.render()}</>
}

export default withDisplayName(SwitchTransition) as <E extends HTMLElement>(
  props: SwitchTransitionProps<E>
) => JSX.Element

import { useDerivedState } from '@kpi/shared'
import { Fragment, createElement } from 'react'
import { isElementEqual } from '../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

import type { SwitchTransitionProps } from './props'

// 转场动画
export default function SwitchTransition<E extends HTMLElement = HTMLElement>(
  props: SwitchTransitionProps<E>
) {
  const { children, mode } = props

  const store = useTransitionStore(props)

  store.syncTransitionProps(props)

  const shouldTransition = !isElementEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    if (mode === 'out-in') store.runOutInSwitch()
    else if (mode === 'in-out') store.runInOutSwitch()
    else store.runDefaultSwitch()

    store.forceUpdate()
  })

  return createElement(Fragment, undefined, store.elements)
}

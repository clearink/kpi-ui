import { useDerivedState } from '@kpi/shared'
import { Fragment, createElement } from 'react'
import useTransitionStore from './hooks/use_transition_store'
import isSameElement from './utils/same'

import type { SwitchTransitionProps } from './props'

// 转场动画
export default function SwitchTransition<E extends HTMLElement = HTMLElement>(
  props: SwitchTransitionProps<E>
) {
  const { children, mode } = props

  const store = useTransitionStore(props)

  const shouldTransition = !isSameElement(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    if (mode === 'out-in') store.runOutInSwitch()
    else if (mode === 'in-out') store.runInOutSwitch()
    else store.runDefaultSwitch()

    store.forceUpdate()
  })

  return createElement(Fragment, undefined, store.elements)
}

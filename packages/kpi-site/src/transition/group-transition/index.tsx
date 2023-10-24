import { useDerivedState } from '@kpi/shared'
import { createElement, Fragment } from 'react'
import { isElementsEqual } from '../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { children } = props

  const store = useTransitionStore(props)

  store.setTransitionProps(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    store.runCleanup()

    store.runTransition()

    store.forceUpdate()
  })

  console.log(store.elements.map((el) => el.key))
  return createElement(Fragment, undefined, store.elements)
}

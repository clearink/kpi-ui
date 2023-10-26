import { createElement, Fragment, useEffect } from 'react'
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

  useEffect(() => {
    const { isInitial } = store

    if (isInitial) store.isInitial = false

    if (shouldTransition) return store.runTransition()

    if (!isInitial) return store.runFlip()
  }, [shouldTransition, store])

  return createElement(Fragment, undefined, store.nodes)
}

import { useDerivedState } from '@kpi/shared'
import { createElement, Fragment, useEffect } from 'react'
import { isElementsEqual } from '../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { tag, children } = props

  const store = useTransitionStore(props)

  store.syncTransitionProps(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) store.coords = store.collectCoords()
  })

  useEffect(() => {
    const { isInitial } = store

    if (isInitial) store.isInitial = false

    if (shouldTransition) return store.runTransition()

    if (!isInitial) return store.runFlip()
  }, [shouldTransition, store])

  return createElement(tag ?? Fragment, undefined, store.nodes)
}

import { useDerivedState } from '@kpi-ui/hooks'
import { createElement, Fragment, useEffect } from 'react'
import { isElementsEqual } from '../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { tag, children } = props

  const store = useTransitionStore(props)

  store.setTransitionProps(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) store.updateCoords()
  })

  useEffect(() => {
    const { isInitial } = store

    if (isInitial) store.setIsInitial(false)

    if (shouldTransition) return store.runTransition()

    if (!isInitial) return store.runFlip()
  }, [shouldTransition, store])

  return createElement(tag ?? Fragment, undefined, store.nodes)
}

import { useDerivedState } from '@kpi-ui/hooks'
import { isNullish, withoutProperties } from '@kpi-ui/utils'
import { createElement, useEffect } from 'react'
import { isElementsEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

import type { GroupTransitionProps } from './props'

const excluded = [
  'ssr',
  'when',
  'name',
  'type',
  'duration',
  'appear',
  'mountOnEnter',
  'unmountOnExit',
  'children',
  'classNames',
  'addEndListener',
  'onEnter',
  'onEntering',
  'onEntered',
  'onEnterCancel',
  'onExit',
  'onExiting',
  'onExited',
  'onExitCancel',
  'tag',
  'onExitComplete',
  'flip',
] as const

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { tag, children } = props

  const store = useTransitionStore(props)

  store.setTransitionProps(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (shouldTransition || !store.shouldFlip()) return
    store.coords = store.getCoords()
  })

  useEffect(() => {
    const { isInitial } = store

    if (isInitial) store.setIsInitial(false)

    if (shouldTransition) return store.runTransition()

    if (!isInitial && store.shouldFlip()) store.runFlip()
  }, [shouldTransition, store])

  if (isNullish(tag)) return <>{store.nodes}</>

  const attrs = withoutProperties(props, excluded)

  return createElement(tag, attrs, store.nodes)
}

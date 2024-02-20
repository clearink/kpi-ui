// utils
import { useDerivedState } from '@kpi-ui/hooks'
import { isNullish, omit, withDisplayName } from '@kpi-ui/utils'
import { createElement, useEffect } from 'react'
import { isElementsEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'
// types
import type { GroupTransitionProps } from './props'

const excluded = [
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

function GroupTransition<E extends HTMLElement = HTMLElement>(props: GroupTransitionProps<E>) {
  const { tag, children } = props

  const store = useTransitionStore(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  let returnEarly = false

  useDerivedState(shouldTransition, () => {
    if (shouldTransition) {
      returnEarly = true

      store.scheduler.start()
    } else if (store.isCanFlip) {
      store.updateCoords()
    }
  })

  useEffect(() => {
    const { scheduler } = store

    if (scheduler.isUpdate()) return scheduler.update()

    // step 2 wait CSSTransition.instance mount
    if (scheduler.isWait()) return scheduler.wait()

    // step 3 run flip
    if (scheduler.isFlip()) return store.flip()
  }, [store, store.scheduler.effect])

  if (returnEarly) return null

  if (isNullish(tag)) return <>{store.render()}</>

  return createElement(tag, omit(props, excluded), store.render())
}

export default withDisplayName(GroupTransition) as <E extends HTMLElement>(
  props: GroupTransitionProps<E>
) => JSX.Element

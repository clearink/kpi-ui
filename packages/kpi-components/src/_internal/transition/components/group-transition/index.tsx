// utils
import { useWatchValue } from '@kpi-ui/hooks'
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

  const { states, actions } = useTransitionStore(props)

  const shouldTransition = !isElementsEqual(states.current, children)

  let returnEarly = false

  useWatchValue(shouldTransition, () => {
    returnEarly = shouldTransition

    if (shouldTransition) actions.startTransition()
    else if (actions.isCanFlip()) states.coords = actions.getCoords()
  })

  useEffect(() => {
    // step 1 update elements
    if (actions.shouldUpdate()) return actions.updateElements()

    // step 2 wait CSSTransition.instance mount
    if (actions.shouldWait()) return actions.waitNextTick()

    // step 3 run flip
    if (actions.shouldFlip()) return actions.runFlip()
  }, [actions, states.effect])

  if (returnEarly) return null

  if (isNullish(tag)) return <>{actions.renderNodes()}</>

  return createElement(tag, omit(props, excluded), actions.renderNodes())
}

export default withDisplayName(GroupTransition) as <E extends HTMLElement>(
  props: GroupTransitionProps<E>
) => JSX.Element

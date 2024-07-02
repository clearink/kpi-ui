import { isNullish, omit, withDisplayName } from '@kpi-ui/utils'
import { useWatchValue } from '_shared/hooks'
import { createElement, useEffect } from 'react'

import type { GroupTransitionProps } from './props'

import { isElementsEqual } from '../../utils/equal'
import useTransitionStore from './hooks/use_transition_store'

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
  const { children, tag } = props

  const { actions, states } = useTransitionStore(props)

  const shouldTransition = !isElementsEqual(states.current, children)

  let returnEarly = false

  useWatchValue(shouldTransition, () => {
    returnEarly = shouldTransition

    if (!actions.isCanFlip() || shouldTransition) actions.updateElements()
    else states.coords = actions.getCoords()
  })

  useEffect(() => {
    const { isInitial } = states

    if (isInitial) actions.setIsInitial(false)

    if (shouldTransition) actions.updateElements()
    else if (actions.shouldFlip(isInitial)) actions.runFlip()
  }, [shouldTransition, states, actions])

  // prettier-ignore
  useEffect(() => () => { actions.setIsInitial(true) }, [actions])

  if (returnEarly) return null

  if (isNullish(tag)) return <>{actions.renderNodes()}</>

  return createElement(tag, omit(props, excluded), actions.renderNodes())
}

export default withDisplayName(GroupTransition) as <E extends HTMLElement>(
  props: GroupTransitionProps<E>,
) => JSX.Element

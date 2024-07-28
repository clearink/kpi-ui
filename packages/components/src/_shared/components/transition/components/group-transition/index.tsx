import { useWatchValue } from '@comps/_shared/hooks'
import { attachDisplayName } from '@comps/_shared/utils'
import { useEffect } from 'react'

import type { GroupTransitionProps } from './props'

import { isElementsEqual } from '../../utils/equal'
import useTransitionFlip from './hooks/use_transition_flip'
import useTransitionStore from './hooks/use_transition_store'

function GroupTransition<E extends HTMLElement = HTMLElement>(props: GroupTransitionProps<E>) {
  const { children } = props

  const { actions, states } = useTransitionStore(props)

  const { isCanFlip, updateCoords, runFlip } = useTransitionFlip(props, states)

  const shouldTransition = !isElementsEqual(states.current, children)

  const returnEarly = useWatchValue(shouldTransition, () => {
    if (isCanFlip()) !shouldTransition && updateCoords()
    else if (shouldTransition) actions.updateElements()

    return !isCanFlip() && shouldTransition
  })

  useEffect(() => {
    const { isInitial } = states

    if (isInitial) actions.setIsInitial(false)

    if (shouldTransition) actions.updateElements()

    else if (!isInitial && isCanFlip()) return runFlip()
  }, [shouldTransition, states, actions, runFlip, isCanFlip])

  useEffect(() => () => { actions.setIsInitial(true) }, [actions])

  return returnEarly ? null : <>{actions.renderNodes()}</>
}

attachDisplayName(GroupTransition)

export default GroupTransition

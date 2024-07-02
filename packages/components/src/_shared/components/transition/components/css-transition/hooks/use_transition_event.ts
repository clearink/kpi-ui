import { batch, isUndefined, makeEventListener, makeFrameTimeout } from '@kpi-ui/utils'
import { hideElement } from '_shared/utils'

import type { CSSTransitionProps, TransitionStep } from '../props'
import type useFormatClassNames from './use_format_class_names'
import type useTransitionStore from './use_transition_store'

import { isAppear, isEnter, isExit } from '../../../constants'
import runCounter from '../../../utils/run_counter'
import { delTransitionClass } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'

export default function useTransitionEvent<E extends HTMLElement>(
  states: ReturnType<typeof useTransitionStore<E>>['states'],
  actions: ReturnType<typeof useTransitionStore<E>>['actions'],
  classNames: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>,
) {
  const { addEndListener, onEnterCancel, onEntered, onExitCancel, onExited, type, unmountOnExit }
    = props

  const done = (el: E, step: TransitionStep) => {
    actions.finishTransition(step)

    const { active, from, to } = classNames[step]

    delTransitionClass(el, from, active, to)

    if (!isExit(step)) return onEntered?.(el, isAppear(step))

    onExited?.(el)

    hideElement(el)

    unmountOnExit && actions.setIsMounted(false)
  }

  const runCancel = (el: E, step: TransitionStep) => {
    if (!isEnter(states.status) && !isExit(states.status)) return

    const { active, from, to } = classNames[step]

    isExit(step) ? onExitCancel?.(el) : onEnterCancel?.(el, isAppear(step))

    delTransitionClass(el, from, active, to)
  }

  const makeCleanupHook = (el: E, step: TransitionStep, timeout?: number) => {
    const resolve = () => done(el, step)

    if (addEndListener) return addEndListener(el, step, resolve)

    if (!isUndefined(timeout)) return makeFrameTimeout(timeout, resolve)

    const collection = getComputedStyle(el, null)

    const transition = collectTimeoutInfo(collection, 'transition')

    const animation = collectTimeoutInfo(collection, 'animation')

    if (transition.timeout <= 0 && animation.timeout <= 0) return makeFrameTimeout(0, resolve)

    if (type === 'transition' && transition.timeout > 0) {
      return batch(
        makeEventListener(el, 'transitionend', runCounter(transition.count, resolve)),
        makeFrameTimeout(transition.timeout, resolve),
      )
    }

    if (type === 'animation' && animation.timeout > 0) {
      return batch(
        makeEventListener(el, 'animationend', runCounter(animation.count, resolve)),
        makeFrameTimeout(animation.timeout, resolve),
      )
    }

    if (transition.timeout > animation.timeout) {
      return batch(
        makeEventListener(el, 'transitionend', runCounter(transition.count, resolve)),
        makeFrameTimeout(transition.timeout, resolve),
      )
    }

    return batch(
      makeEventListener(el, 'animationend', runCounter(animation.count, resolve)),
      makeFrameTimeout(animation.timeout, resolve),
    )
  }

  return [runCancel, makeCleanupHook] as const
}

import { isUndefined } from '@kpi-ui/utils'
import { batch } from '../../../_shared/utils'
import { isAppear, isEnter, isExit } from '../../../constants'
import runCounter from '../../../utils/run_counter'
import { delTransitionClass } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import { hideElement } from '../utils/display'
import { addListener, addTimeout } from '../utils/listener'
import useFormatClassNames from './use_format_class_names'
import useTransitionStore from './use_transition_store'
// types
import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEvent<E extends HTMLElement>(
  states: ReturnType<typeof useTransitionStore<E>>['states'],
  actions: ReturnType<typeof useTransitionStore<E>>['actions'],
  classNames: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { type, unmountOnExit, addEndListener, onEntered, onExited, onEnterCancel, onExitCancel } =
    props

  const done = (el: E, step: TransitionStep) => {
    actions.finishTransition(step)

    const { from, active, to } = classNames[step]

    delTransitionClass(el, from, active, to)

    if (!isExit(step)) return onEntered?.(el, isAppear(step))

    onExited?.(el)

    hideElement(el)

    unmountOnExit && actions.setIsMounted(false)
  }

  const runCancel = (el: E, step: TransitionStep) => {
    if (!isEnter(states.status) && !isExit(states.status)) return

    const { from, active, to } = classNames[step]

    isExit(step) ? onExitCancel?.(el) : onEnterCancel?.(el, isAppear(step))

    delTransitionClass(el, from, active, to)
  }

  const makeCleanupHook = (el: E, step: TransitionStep, timeout?: number) => {
    const resolve = () => done(el, step)

    if (addEndListener) return addEndListener(el, step, resolve)

    if (!isUndefined(timeout)) return addTimeout(timeout, resolve)

    const collection = getComputedStyle(el, null)

    const transition = collectTimeoutInfo(collection, 'transition')

    const animation = collectTimeoutInfo(collection, 'animation')

    if (transition.timeout <= 0 && animation.timeout <= 0) return addTimeout(0, resolve)

    if (type === 'transition' && transition.timeout > 0) {
      return batch(
        addListener(el, 'transitionend', runCounter(transition.count, resolve)),
        addTimeout(transition.timeout, resolve)
      )
    }

    if (type === 'animation' && animation.timeout > 0) {
      return batch(
        addListener(el, 'animationend', runCounter(animation.count, resolve)),
        addTimeout(animation.timeout, resolve)
      )
    }

    if (transition.timeout > animation.timeout) {
      return batch(
        addListener(el, 'transitionend', runCounter(transition.count, resolve)),
        addTimeout(transition.timeout, resolve)
      )
    }

    return batch(
      addListener(el, 'animationend', runCounter(animation.count, resolve)),
      addTimeout(animation.timeout, resolve)
    )
  }

  return [runCancel, makeCleanupHook] as const
}

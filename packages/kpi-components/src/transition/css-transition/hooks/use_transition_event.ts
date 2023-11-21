import { isUndefined } from '@kpi-ui/utils'
import { isAppear, isExit } from '../../_shared/constant'
import { batch } from '../../_shared/utils'
import { delTransitionClass } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import { addListener, addTimeout } from '../utils/listener'
import runCounter from '../../utils/run_counter'
import useFormatClassNames from './use_format_class_names'
import useTransitionStore from './use_transition_store'

import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEvent<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classes: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { type, unmountOnExit, addEndListener, onEntered, onExited, onEnterCancel, onExitCancel } =
    props

  const done = (el: E, step: TransitionStep) => {
    store.finish(step)

    const { from, active, to } = classes[step]

    delTransitionClass(el, from, active, to)

    if (!isExit(step)) return onEntered && onEntered(el, isAppear(step))

    onExited && onExited(el)

    store.hidden()

    unmountOnExit && store.destroy()
  }

  const runCancel = (el: E, step: TransitionStep) => {
    const { from, active, to } = classes[step]

    if (isExit(step)) onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, isAppear(step))

    delTransitionClass(el, from, active, to)
  }

  const makeEndHook = (el: E, step: TransitionStep, timeout?: number) => {
    const resolve = done.bind(null, el, step)

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

  return [runCancel, makeEndHook] as const
}

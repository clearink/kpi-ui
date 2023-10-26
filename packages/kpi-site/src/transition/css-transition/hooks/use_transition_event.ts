import { isUndefined, useEvent } from '@kpi/shared'
import { delTransitionClass } from '../../utils/classnames'
import { addListener, addTimeout } from '../../utils/listener'
import runCounter from '../../utils/run_counter'
import { isAppear, isExit } from '../constants/status'
import batch from '../utils/batch'
import collectTimeoutInfo from '../utils/collect'
import useFormatClassNames from './use_format_class_names'
import useTransitionStore from './use_transition_store'

import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEvent<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classes: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { type, unmountOnExit, onEntered, onExited, onEnterCancel, onExitCancel } = props

  const runCancel = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classes[step]

    delTransitionClass(el, from, active, to)

    if (isExit(step)) onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, isAppear(step))
  })

  const done = useEvent((el: E, step: TransitionStep) => {
    store.finish(step)

    const { from, active, to } = classes[step]

    delTransitionClass(el, from, active, to)

    if (!isExit(step)) return onEntered && onEntered(el, isAppear(step))

    onExited && onExited(el)

    store.hidden()

    unmountOnExit && store.destroy()
  })

  const makeEndHook = useEvent((el: E, step: TransitionStep, timeout?: number) => {
    const resolve = done.bind(null, el, step)

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
  })

  return [runCancel, makeEndHook, done] as const
}

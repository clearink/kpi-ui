/* eslint-disable no-param-reassign */
import { isUndefined, useEvent } from '@kpi/shared'
import batch from '../utils/batch'
import { delClassName } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import { addListener, addTimeout } from '../utils/listener'
import useFormatClassNames from './use_format_class_names'
import useTransitionStore from './use_transition_store'

import type { CSSTransitionProps, TransitionStep } from '../props'

// 结束状态
export default function useTransitionEvent<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classes: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { type, unmountOnExit, onEntered, onExited, onEnterCancel, onExitCancel } = props

  const runCancel = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classes[step]

    delClassName(el, from, active, to)

    if (step === 'exit') onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, step === 'appear')
  })

  const done = useEvent((el: E, step: TransitionStep) => {
    store.running = false

    store.runEndHook()

    const { from, active, to } = classes[step]

    delClassName(el, from, active, to)

    if (step !== 'exit') return onEntered && onEntered(el, step === 'appear')

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

    const makeEndListener = (count: number) => {
      let ended = 0
      return () => ++ended >= count && resolve()
    }

    if (type === 'transition' && transition.timeout > 0) {
      return batch(
        addListener(el, 'transitionend', makeEndListener(transition.count)),
        addTimeout(transition.timeout, resolve)
      )
    }

    if (type === 'animation' && animation.timeout > 0) {
      return batch(
        addListener(el, 'animationend', makeEndListener(animation.count)),
        addTimeout(animation.timeout, resolve)
      )
    }

    if (transition.timeout > animation.timeout) {
      return batch(
        addListener(el, 'transitionend', makeEndListener(transition.count)),
        addTimeout(transition.timeout, resolve)
      )
    }

    return batch(
      addListener(el, 'animationend', makeEndListener(animation.count)),
      addTimeout(animation.timeout, resolve)
    )
  })

  return [runCancel, makeEndHook, done] as const
}

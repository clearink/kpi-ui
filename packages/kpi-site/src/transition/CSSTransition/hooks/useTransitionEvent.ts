import { isUndefined, useEvent } from '@kpi/shared'
import { addListener, makeTimeout } from '../utils/listener'
import { delClassName } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'

import type { CSSTransitionProps, TransitionStep } from '../props'

// 结束状态
export default function useTransitionEvent<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { type, css, onEntered, onExited, onEnterCancel, onExitCancel } = props

  const runCancel = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    delClassName(el, from, active, to)

    if (step === 'exit') onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, step === 'appear')
  })

  const done = useEvent((el: E, step: TransitionStep) => {
    store.running(false)
    store.runEndCleanup(true)

    // 删除 className
    const { from, active } = classNames[step]
    delClassName(el, from, active)

    if (step === 'exit') onExited && onExited(el)
    else onEntered && onEntered(el, step === 'appear')
  })

  const runEnd = useEvent((el: E, step: TransitionStep, timeout?: number) => {
    if (css === false) return () => {}

    const resolve = () => done(el, step)

    if (!isUndefined(timeout)) return makeTimeout(timeout, resolve)

    const collection = getComputedStyle(el, null)

    const [tranTimeout, tranCount] = collectTimeoutInfo(collection, 'transition')

    const [animTimeout, animCount] = collectTimeoutInfo(collection, 'animation')

    if (tranTimeout <= 0 && animTimeout <= 0) return makeTimeout(0, resolve)

    const makeEndHook = (count: number) => {
      let ended = 0
      return () => {
        ++ended >= count && done(el, step)
      }
    }

    if (type === 'transition' && tranTimeout > 0) {
      return addListener(el, 'transitionend', makeEndHook(tranCount))
    }

    if (type === 'animation' && animTimeout > 0) {
      return addListener(el, 'animationend', makeEndHook(animCount))
    }

    if (tranTimeout > animTimeout) {
      return addListener(el, 'transitionend', makeEndHook(tranCount))
    }

    return addListener(el, 'animationend', makeEndHook(animCount))
  })

  return [runCancel, runEnd, done] as const
}

import { isUndefined, useEvent } from '@kpi/shared'
import { addListener, makeTimeout } from '../utils/add_listener'
import { delClassName } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'

import type { TransitionProps, TransitionStep } from '../props'

// 结束状态
export default function useTransitionEvent<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { type, css, unmountOnExit, onEntered, onExited, onEnterCancel, onExitCancel } = props

  const cancel = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]
    delClassName(el, from, active, to)

    if (step === 'exit') onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, step === 'appear')
  })

  // 到底要做什么事情?
  const done = useEvent((el: E, step: TransitionStep) => {
    store.running(false)
    store.runEndCleanup(true)

    // 删除 className
    const { from, active } = classNames[step]
    delClassName(el, from, active)

    const exiting = step === 'exit'

    if (!exiting) onEntered && onEntered(el, step === 'appear')
    else onExited && onExited(el)

    if (unmountOnExit && exiting) store.setInstance(null, true)
  })

  const end = useEvent((el: E, step: TransitionStep, timeout?: number) => {
    if (css === false) return () => {}

    const resolve = () => done(el, step)

    if (!isUndefined(timeout)) return makeTimeout(timeout, resolve)

    const collection = getComputedStyle(el, null)

    const style = (property: string): string[] => (collection[property] || '').split(', ')

    const tranInfo = collectTimeoutInfo(style('transitionDelay'), style('transitionDuration'))

    const animInfo = collectTimeoutInfo(style('animationDelay'), style('animationDuration'))

    if (tranInfo.timeout <= 0 && animInfo.timeout <= 0) return makeTimeout(0, resolve)

    const makeEndHook = (count: number) => {
      let ended = 0
      return () => {
        ++ended >= count && done(el, step)
      }
    }

    if (type === 'transition' && tranInfo.timeout > 0) {
      return addListener(el, 'transitionend', makeEndHook(tranInfo.count))
    }

    if (type === 'animation' && animInfo.timeout > 0) {
      return addListener(el, 'animationend', makeEndHook(animInfo.count))
    }

    if (tranInfo.timeout > animInfo.timeout) {
      return addListener(el, 'transitionend', makeEndHook(tranInfo.count))
    }

    return addListener(el, 'animationend', makeEndHook(animInfo.count))
  })

  return [cancel, end, done] as const
}

/**
 * 1. 指定 timeout, 代表使用定时器
 * Q: 定时器到期时需要做什么 ?
 * A: 1. 去除 className
 *    2. 执行回调函数
 *    3. 执行 unmountOnExit 等一些特殊的逻辑
 * Q: 清理函数 ?
 * A: 可以保存在 store 中
 *
 */

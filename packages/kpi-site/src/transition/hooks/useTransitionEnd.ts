/* eslint-disable @typescript-eslint/naming-convention */
import { isNumber, isUndefined, useEvent, useIsomorphicEffect, useUnmountEffect } from '@kpi/shared'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import { delClassName } from '../utils/classnames'
import collectTimeoutInfo from '../utils/collect'
import normalizeDuration from '../utils/duration'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'

import type { TransitionProps, TransitionStep } from '../props'

function addEventListener<E extends Element>(
  el: E,
  event: string,
  handler: () => any,
  options?: any
) {
  el.addEventListener(event, handler, options)
  return () => {
    el.removeEventListener(event, handler, options)
  }
}

// 结束状态
export default function useTransitionEnd<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { type, unmountOnExit, addEndListener, onEntered, onExited } = props

  const done = useEvent((el: E, step: TransitionStep) => {
    // 删除 className
    delClassName(el, classNames[step].from)
    delClassName(el, classNames[step].active)
    delClassName(el, classNames[step].to)

    const exiting = step === 'exit'

    if (exiting) onExited && onExited(el)
    else onEntered && onEntered(el, step === 'appear')

    if (unmountOnExit && exiting) store.setInstance(null)
  })

  const onTimeoutFinish = useCallback((timeout: number, callback: () => void) => {
    const id = setTimeout(callback, timeout)

    return clearTimeout.bind(null, id)
  }, [])

  return useEvent((el: E, step: TransitionStep, timeout?: number) => {
    // 一定会生成一个 setTimeout 用于 removeEventListener

    const resolve = () => done(el, step)

    if (!isUndefined(timeout)) return onTimeoutFinish(timeout, resolve)

    const collection = getComputedStyle(el, null)

    const style = (property: string): string[] => (collection[property] || '').split(', ')

    const transitions = collectTimeoutInfo(style('transitionDelay'), style('transitionDuration'))

    const animations = collectTimeoutInfo(style('animationDelay'), style('animationDuration'))

    if (transitions.timeout <= 0 && animations.timeout <= 0) return resolve()

    if (type === 'transition' && transitions.timeout > 0) {
      return addEventListener(el, 'transitionend', resolve)
    }

    if (type === 'animation' && animations.timeout > 0) {
      return addEventListener(el, 'animationend', resolve)
    }

    if (transitions.timeout > animations.timeout) {
      return addEventListener(el, 'transitionend', resolve)
    }

    return addEventListener(el, 'animationend', resolve)
  })
}

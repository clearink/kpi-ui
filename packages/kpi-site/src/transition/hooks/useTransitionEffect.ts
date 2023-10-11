import { useEvent, useIsomorphicEffect } from '@kpi/shared'
import { useMemo } from 'react'
import { addClassName, delClassName } from '../utils/classnames'
import nextFrame from '../utils/next_frame'
import reflow from '../utils/reflow'
import useFormatClassNames from './useFormatClassNames'
import useTransitionCancel from './useTransitionCancel'
import useTransitionEnd from './useTransitionEnd'
import useTransitionStore from './useTransitionStore'
import normalizeDuration from '../utils/duration'

import type { TransitionProps, TransitionStep } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { appear, when, duration, onEnter, onEntering, onExit, onExiting } = props

  const timeouts = useMemo(() => normalizeDuration(duration), [duration])

  const handleTransitionEnd = useTransitionEnd(store, classNames, props)

  const handleTransitionCancel = useTransitionCancel(store, classNames, props)

  // name 改变不会重新应用动画, 决定是否需要进行动画的只有 when 属性
  const handleTransition = useEvent((step: TransitionStep) => {
    const el = store.instance

    if (!el) return

    const appearing = step === 'appear'

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, appearing)

    addClassName(el, classNames[step].from)

    if (step === 'exit') reflow(el)

    addClassName(el, classNames[step].active)

    // 设置 状态
    store.running(true)

    const handleNextFrameCancel = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, appearing)

      delClassName(el, classNames[step].from)

      addClassName(el, classNames[step].to)

      handleTransitionEnd(el, step, timeouts[step])
    })

    return () => {
      handleNextFrameCancel()

      handleTransitionCancel(el, step)

      store.running(false)
    }
  })

  useIsomorphicEffect(() => {
    store.updateCounter()

    if (store.updateGteTwoTimes) return handleTransition(when ? 'enter' : 'exit')

    if (appear) return handleTransition('appear')
  }, [appear, store, handleTransition, when])
}

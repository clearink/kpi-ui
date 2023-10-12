import { useEvent, useIsomorphicEffect } from '@kpi/shared'
import { useMemo } from 'react'
import { addClassName, delClassName } from '../utils/classnames'
import normalizeDuration from '../utils/duration'
import nextFrame from '../utils/next_frame'
import useFormatClassNames from './useFormatClassNames'
import useTransitionEvent from './useTransitionEvent'
import useTransitionStore from './useTransitionStore'

import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { appear, when, duration, addEndListener, onEnter, onEntering, onExit, onExiting } = props

  const timeouts = useMemo(() => normalizeDuration(duration), [duration])

  const [runCancel, end, done] = useTransitionEvent(store, classNames, props)

  const handleTransition = useEvent((step: TransitionStep) => {
    const el = store.instance

    if (!el) return

    const appearing = step === 'appear'

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, appearing)

    const { from, active, to } = classNames[step]
    addClassName(el, from, active)

    store.running(true)

    const cancelNextFrame = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, appearing)

      delClassName(el, from)

      addClassName(el, to)

      // 保存结束时的回调
      store.setEndCleanup(
        addEndListener
          ? addEndListener(el, step, () => done(el, step))
          : end(el, step, timeouts[step])
      )
    })

    return () => {
      cancelNextFrame()

      // 清除该次动画的结束函数
      store.runEndCleanup(true)

      if (store.running()) runCancel(el, step)

      delClassName(el, to)
    }
  })

  const handleInitClass = useEvent(() => {
    const el = store.instance

    if (!el) return

    const className = classNames[when ? 'enter' : 'exit'].to

    addClassName(el, className)

    return () => {
      delClassName(el, className)
    }
  })

  useIsomorphicEffect(() => {
    store.updateCounter()

    if (store.updateGteTwoTimes) return handleTransition(when ? 'enter' : 'exit')

    if (appear && when) return handleTransition('appear')

    return handleInitClass()
  }, [appear, handleInitClass, handleTransition, store, when])
}

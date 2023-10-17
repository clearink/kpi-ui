import { useEvent } from '@kpi/shared'
import { useEffect } from 'react'
import { addClassName, delClassName } from '../utils/classnames'
import nextFrame from '../utils/next_frame'
import reflow from '../utils/reflow'
import useFormatClassNames from './use_format_class_names'
import useFormatTimeouts from './use_format_timeouts'
import useTransitionEvent from './use_transition_event'
import useTransitionStore from './use_transition_store'

import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  timeouts: ReturnType<typeof useFormatTimeouts>,
  props: CSSTransitionProps<E>
) {
  const { appear, when, addEndListener, onEnter, onEntering, onExit, onExiting } = props

  const [runCancel, makeEndHook, done] = useTransitionEvent(store, classNames, props)

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    store.running(true)

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, step === 'appear')

    const { from, active, to } = classNames[step]

    addClassName(el, from)

    step === 'exit' && reflow(el)

    addClassName(el, active)

    const runFrameCleanup = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, step === 'appear')

      delClassName(el, from)

      addClassName(el, to)

      // 保存结束时的回调
      store.setEndHook(
        addEndListener
          ? addEndListener(el, step, () => done(el, step))
          : makeEndHook(el, step, timeouts[step])
      )
    })

    return () => {
      runFrameCleanup()

      store.runEndHook()

      delClassName(el, to)

      store.running() && runCancel(el, step)
    }
  })

  useEffect(() => {
    const { isInitial, instance } = store

    isInitial && store.setIsInitial(false)

    if (!instance) return

    if (!isInitial) return runTransition(instance, when ? 'enter' : 'exit')

    if (appear && when) return runTransition(instance, 'appear')

    return store.runInitHook
  }, [appear, runTransition, store, when])
}

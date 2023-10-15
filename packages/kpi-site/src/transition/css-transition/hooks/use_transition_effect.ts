import { useEvent } from '@kpi/shared'
import { useEffect } from 'react'
import { addTransitionClass, delTransitionClass } from '../utils/classnames'
import nextFrame from '../utils/next_frame'
import useFormatClassNames from './use_format_class_names'
import useFormatTimeouts from './use_format_timeouts'
import useTransitionEvent from './use_transition_event'
import useTransitionStore from './use_transition_store'

import type { CSSTransitionProps, TransitionStep } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: CSSTransitionProps<E>
) {
  const { appear, when, addEndListener, onEnter, onEntering, onExit, onExiting } = props

  const timeouts = useFormatTimeouts(props.duration)

  const [runCancel, makeEndHook, done] = useTransitionEvent(store, classNames, props)

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, step === 'appear')

    const { from, active, to } = classNames[step]

    addTransitionClass(el, from, active)

    store.running(true)

    const runFrameCleanup = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, step === 'appear')

      delTransitionClass(el, from)

      addTransitionClass(el, to)

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

      if (store.running()) runCancel(el, step)
      else delTransitionClass(el, to)
    }
  })

  useEffect(() => {
    store.updateCounter()

    if (!store.instance) return

    const step = when ? 'enter' : 'exit'

    if (!store.isInitial) return runTransition(store.instance, step)

    if (appear && when) return runTransition(store.instance, 'appear')

    return store.runInitHook
  }, [appear, runTransition, store, when])
}

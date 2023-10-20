import { useEvent } from '@kpi/shared'
import { useEffect } from 'react'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEvent from './hooks/use_transition_event'
import useTransitionStore from './hooks/use_transition_store'
import { addClassName, delClassName } from './utils/classnames'
import nextFrame from './utils/next_frame'
import reflow from './utils/reflow'

import type { CSSTransitionProps, TransitionStep } from './props'

export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>
) {
  const {
    children,
    name,
    when,
    classNames,
    ssr,
    addEndListener,
    onEnter,
    onEntering,
    onExit,
    onExiting,
    duration,
  } = props

  const store = useTransitionStore<E>(props)

  const classes = useFormatClassNames(name, classNames)

  const timeouts = useFormatTimeouts(duration)

  const [runCancel, makeEndHook, done] = useTransitionEvent(store, classes, props)

  if (ssr && store.isInitial) reflow()

  const refCallback = useEvent((el: E | null) => {
    store.instance = el

    if (store.appear || !when) store.hidden()
  })

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    store.running = true

    store.unmount = false

    store.show()

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, step === 'appear')

    const { from, active, to } = classes[step]

    addClassName(el, from)

    step === 'exit' && reflow(el)

    addClassName(el, active)

    const runFrameCleanup = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, step === 'appear')

      delClassName(el, from)

      addClassName(el, to)

      // 保存结束时的回调
      store.endHook = addEndListener
        ? addEndListener(el, step, done.bind(null, el, step))
        : makeEndHook(el, step, timeouts[step])
    })

    return () => {
      runFrameCleanup()

      store.runEndHook()

      store.running && runCancel(el, step)
    }
  })

  useEffect(() => {
    const { isInitial, instance } = store

    if (isInitial) store.isInitial = false

    if (!instance) return

    if (!isInitial) return runTransition(instance, when ? 'enter' : 'exit')

    if (store.appear && when) return runTransition(instance, 'appear')
  }, [runTransition, store, when])

  return store.unmount ? null : children(refCallback)
}

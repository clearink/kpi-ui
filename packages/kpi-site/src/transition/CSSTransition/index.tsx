import { useEvent } from '@kpi/shared'
import { useEffect } from 'react'
import useFormatClassNames from './hooks/useFormatClassNames'
import useFormatTimeouts from './hooks/useFormatTimeouts'
import useTransitionEvent from './hooks/useTransitionEvent'
import useTransitionStore from './hooks/useTransitionStore'
import { addTransitionClass, delTransitionClass } from './utils/classnames'
import nextFrame from './utils/next_frame'

import type { CSSTransitionProps, TransitionStep } from './props'

// 还是要添加 mountOnEnter 与 unmountOnExit
export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>
) {
  const { appear, when, addEndListener, onEnter, onEntering, onExit, onExiting } = props

  const store = useTransitionStore<E>()

  const timeouts = useFormatTimeouts(props.duration)

  const classNames = useFormatClassNames(props.name, props.classNames)

  const [runCancel, makeEndHook, done] = useTransitionEvent(store, classNames, props)

  const handleTransition = useEvent((el: E, step: TransitionStep) => {
    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, step === 'appear')

    const { from, active, to } = classNames[step]

    addTransitionClass(el, from, active)

    store.running(true)

    const cleanupFrameHook = nextFrame(() => {
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
      cleanupFrameHook()
      store.runEndHook()

      if (store.running()) runCancel(el, step)
      else delTransitionClass(el, to)
    }
  })

  useEffect(() => {
    store.updateCounter()

    if (!store.instance) return

    const step = when ? 'enter' : 'exit'

    if (!store.isInitial) return handleTransition(store.instance, step)

    if (appear && when) return handleTransition(store.instance, 'appear')

    return store.runInitHook
  }, [appear, handleTransition, store, when])

  return props.children(
    useEvent((el: E | null) => {
      store.setInstance(el)

      if (!el || addEndListener || store.instance === el) return

      const step = when ? 'enter' : 'exit'
      const appearInitial = !!(appear && when && store.isInitial)
      const className = appearInitial ? classNames.appear.from : classNames[step].to

      addTransitionClass(el, className)

      store.setInitHook(() => delTransitionClass(el, className))
    })
  )
}

import { useEvent } from '@kpi-ui/hooks'
import { addClassNames, delClassNames, nextFrame, fillRef } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, type Ref } from 'react'
import { reflow } from '../../_shared/utils'
import { APPEAR, ENTER, EXIT, isAppear, isExit } from '../../constant'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEvent from './hooks/use_transition_event'
import useTransitionStore from './hooks/use_transition_store'

import type { CSSTransitionProps, CSSTransitionRef, TransitionStep } from './props'

function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>,
  ref: Ref<CSSTransitionRef<E>>
) {
  const { children, name, when, ssr, duration, onEnter, onEntering, onExit, onExiting } = props

  const store = useTransitionStore<E>(props)

  if (store.isInitial && ssr) reflow()

  const classNames = useFormatClassNames(name, props.classNames)

  const timeouts = useFormatTimeouts(duration)

  useImperativeHandle(ref, () => store, [store])

  const [runCancel, makeEndHook] = useTransitionEvent(store, classNames, props)

  const refCallback = useEvent((el: E | null) => {
    fillRef(el, (children as any).ref)

    if (el && !store.mounted) store.setMounted(true)

    store.setInstance(el)

    store.display.stash()

    if (store.appear || !when) store.display.hide()
  })

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    store.start(step)

    addClassNames(el, from)

    isExit(step) && reflow(el)

    addClassNames(el, active)

    if (isExit(step)) onExit && onExit(el)
    else onEnter && onEnter(el, isAppear(step))

    const runFrameCleanup = nextFrame(() => {
      delClassNames(el, from)

      addClassNames(el, to)

      if (isExit(step)) onExiting && onExiting(el)
      else onEntering && onEntering(el, isAppear(step))

      // 保存结束时的回调
      store.setEndHook(makeEndHook(el, step, timeouts[step]))
    })

    return () => {
      runFrameCleanup()

      store.runEndHook()

      store.running && runCancel(el, step)
    }
  })

  useEffect(() => {
    const { isInitial, instance } = store

    if (isInitial) store.setIsInitial(false)

    if (!(instance && store.shouldTransition(isInitial, when))) return

    if (!isInitial) return runTransition(instance, when ? ENTER : EXIT)

    if (store.appear && when) return runTransition(instance, APPEAR)
  }, [runTransition, store, when])

  return !when && store.unmount ? null : cloneElement(children, { ref: refCallback })
}

export default forwardRef(CSSTransition) as <E extends HTMLElement>(
  props: CSSTransitionProps<E> & { ref?: Ref<CSSTransitionRef<E>> }
) => JSX.Element

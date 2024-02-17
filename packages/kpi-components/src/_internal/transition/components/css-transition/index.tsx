import { useEvent } from '@kpi-ui/hooks'
import { fillRef, nextFrame } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, type Ref } from 'react'
import { reflow } from '../../_shared/utils'
import { APPEAR, ENTER, EXIT, isAppear, isExit, isExited } from '../../constants'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEvent from './hooks/use_transition_event'
import useTransitionStore from './hooks/use_transition_store'

import type { CSSTransitionProps, CSSTransitionRef, TransitionStep } from './props'

function CSSTransition<E extends HTMLElement>(
  props: CSSTransitionProps<E>,
  ref: Ref<CSSTransitionRef<E>>
) {
  const { children, name, when, duration, onEnter, onEntering, onExit, onExiting } = props

  const display = children.props.style?.display
  const cls = children.props.className

  const store = useTransitionStore<E>(props)

  const classNames = useFormatClassNames(name, props.classNames)

  const timeouts = useFormatTimeouts(duration)

  useImperativeHandle(ref, () => store, [store])

  const [runCancel, makeEndHook] = useTransitionEvent(store, classNames, props)

  const refCallback = (el: E | null) => {
    fillRef(el, (children as any).ref)

    store.setInstance(el)

    el && store.setHasMounted()

    store.classNames.restore()

    if (isAppear(store.status) || isExited(store.status)) store.display.hide()
  }

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    store.start(step, display)

    store.classNames.add(from)

    isExit(step) && reflow(el)

    store.classNames.add(active)

    isExit(step) ? onExit?.(el) : onEnter?.(el, isAppear(step))

    const runFrameCleanup = nextFrame(() => {
      store.classNames.del(from)

      store.classNames.add(to)

      isExit(step) ? onExiting?.(el) : onEntering?.(el, isAppear(step))

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

  if (!when && !store.isMounted) return null

  return cloneElement(children, { ref: refCallback })
}

export default forwardRef(CSSTransition) as <E extends HTMLElement>(
  props: CSSTransitionProps<E> & { ref?: Ref<CSSTransitionRef<E>> }
) => JSX.Element | null

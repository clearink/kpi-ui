// utils
import { useEvent } from '@kpi-ui/hooks'
import { fillRef, nextFrame, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useImperativeHandle, type Ref } from 'react'
import { reflow } from '../../_shared/utils'
import { APPEAR, ENTER, EXIT, isAppear, isExit, isExited } from '../../constants'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEvent from './hooks/use_transition_event'
import useTransitionStore from './hooks/use_transition_store'
import { addTransitionClass, delTransitionClass, recoverTransitionClass } from './utils/classnames'
// types
import type { CSSTransitionProps, CSSTransitionRef, TransitionStep } from './props'

function CSSTransition<E extends HTMLElement>(
  props: CSSTransitionProps<E>,
  ref: Ref<CSSTransitionRef<E>>
) {
  const { children, name, when, duration, onEnter, onEntering, onExit, onExiting } = props

  const display = children.props.style?.display

  const [store, returnEarly] = useTransitionStore<E>(props)

  const classNames = useFormatClassNames(name, props.classNames)

  const timeouts = useFormatTimeouts(duration)

  useImperativeHandle(ref, () => store, [store])

  const [runCancel, makeEndHook] = useTransitionEvent(store, classNames, props)

  const refCallback = (el: E | null) => {
    fillRef(el, (children as any).ref)

    store.setInstance(el)

    el && store.setHasMounted()

    el && recoverTransitionClass(el)

    if (isAppear(store.status) || isExited(store.status)) store.display.hide()
  }

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    store.start(step, display)

    addTransitionClass(el, from)

    isExit(step) && reflow(el)

    addTransitionClass(el, active)

    isExit(step) ? onExit?.(el) : onEnter?.(el, isAppear(step))

    const runFrameCleanup = nextFrame(() => {
      delTransitionClass(el, from)

      addTransitionClass(el, to)

      isExit(step) ? onExiting?.(el) : onEntering?.(el, isAppear(step))

      store.setEndHook(makeEndHook(el, step, timeouts[step]))
    })

    return () => {
      runFrameCleanup()

      store.runEndHook()

      runCancel(el, step)
    }
  })

  useEffect(() => {
    const { scheduler, instance } = store

    if (scheduler.shouldMount()) return scheduler.beMounted()

    if (!(instance && store.shouldTransition(when))) return

    if (scheduler.shouldRunFirst()) return runTransition(instance, APPEAR)

    return runTransition(instance, when ? ENTER : EXIT)
  }, [runTransition, store, store.scheduler.effect, when])

  return returnEarly || !store.isMounted ? null : cloneElement(children, { ref: refCallback })
}

export default withDisplayName(forwardRef(CSSTransition), 'CSSTransition') as <
  E extends HTMLElement
>(
  props: CSSTransitionProps<E> & { ref?: Ref<CSSTransitionRef<E>> }
) => JSX.Element | null

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
import { hideElement } from './utils/display'
// types
import type { CSSTransitionProps, CSSTransitionRef, TransitionStep } from './props'

function CSSTransition<E extends HTMLElement>(
  props: CSSTransitionProps<E>,
  ref: Ref<CSSTransitionRef<E>>
) {
  const { children, name, when, duration, onEnter, onEntering, onExit, onExiting } = props

  const display = children.props.style?.display

  const { states, actions, returnEarly } = useTransitionStore<E>(props)

  // prettier-ignore
  useImperativeHandle(ref, () => ({ 
    get instance(){ return states.instance }, 
    get status(){ return states.status } 
  }), [states])

  const classNames = useFormatClassNames(name, props.classNames)

  const timeouts = useFormatTimeouts(duration)

  const [runCancel, makeEndHook] = useTransitionEvent(states, actions, classNames, props)

  const refCallback = (el: E | null) => {
    fillRef(el, (children as any).ref)

    states.instance = el

    if (el) states.hasMounted = true

    el && recoverTransitionClass(el)

    if (isAppear(states.status) || isExited(states.status)) hideElement(el)
  }

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    console.log('runTransition', el, step)
    actions.startTransition(step, display)

    addTransitionClass(el, from)

    isExit(step) && reflow(el)

    addTransitionClass(el, active)

    isExit(step) ? onExit?.(el) : onEnter?.(el, isAppear(step))

    const runFrameCleanup = nextFrame(() => {
      delTransitionClass(el, from)

      addTransitionClass(el, to)

      isExit(step) ? onExiting?.(el) : onEntering?.(el, isAppear(step))

      states.cleanupHook = makeEndHook(el, step, timeouts[step])
    })

    return () => {
      runFrameCleanup()

      actions.runCleanupHook()

      runCancel(el, step)
    }
  })

  useEffect(() => {
    const el = states.instance
    console.log('useEffect')

    if (actions.shouldMount()) return actions.beMounted()

    if (!(el && actions.shouldTransition(when))) return

    if (actions.shouldRunFirst()) return runTransition(el, APPEAR)

    return runTransition(el, when ? ENTER : EXIT)
  }, [runTransition, when, actions, states.instance, states.effect])

  return returnEarly || !states.isMounted ? null : cloneElement(children, { ref: refCallback })
}

export default withDisplayName(forwardRef(CSSTransition), 'CSSTransition') as <
  E extends HTMLElement
>(
  props: CSSTransitionProps<E> & { ref?: Ref<CSSTransitionRef<E>> }
) => JSX.Element | null

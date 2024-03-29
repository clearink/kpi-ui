// utils
import { useEvent } from '@kpi-ui/hooks'
import { fillRef, nextFrame, nextTick, withDisplayName } from '@kpi-ui/utils'
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

  const [runCancel, makeCleanupHook] = useTransitionEvent(states, actions, classNames, props)

  const refCallback = (el: E | null) => {
    fillRef(el, (children as any).ref)

    states.instance = el

    if (el) states.hasMounted = true

    el && recoverTransitionClass(el)

    if (isAppear(states.status) || isExited(states.status)) hideElement(el)
  }

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    const { from, active, to } = classNames[step]

    const runTickCleanup = nextTick(() => {
      actions.startTransition(step, display)

      isExit(step) ? onExit?.(el) : onEnter?.(el, isAppear(step))

      addTransitionClass(el, from)

      isExit(step) && reflow(el)

      addTransitionClass(el, active)
    })

    const runFrameCleanup = nextFrame(() => {
      isExit(step) ? onExiting?.(el) : onEntering?.(el, isAppear(step))

      delTransitionClass(el, from)

      addTransitionClass(el, to)

      states.cleanupHook = makeCleanupHook(el, step, timeouts[step])
    })

    return () => {
      runTickCleanup()

      runFrameCleanup()

      actions.runCleanupHook()

      runCancel(el, step)
    }
  })

  useEffect(() => {
    const { instance: el, isInitial } = states

    if (isInitial) actions.setIsInitial(false)

    if (!el) return

    if (actions.shouldAppear(isInitial, when)) return runTransition(el, APPEAR)

    if (actions.shouldEnter(isInitial, when)) return runTransition(el, ENTER)

    if (actions.shouldExit(isInitial, when)) return runTransition(el, EXIT)
  }, [runTransition, when, states, actions])

  // prettier-ignore
  useEffect(() => () => { actions.setIsInitial(true) }, [actions])

  return returnEarly || !states.isMounted ? null : cloneElement(children, { ref: refCallback })
}

export default withDisplayName(forwardRef(CSSTransition), 'CSSTransition') as <
  E extends HTMLElement
>(
  props: CSSTransitionProps<E> & { ref?: Ref<CSSTransitionRef<E>> }
) => JSX.Element | null

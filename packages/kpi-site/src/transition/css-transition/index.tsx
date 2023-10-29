import { isFunction, isObject, useEvent } from '@kpi/shared'
import type { ReactElement, Ref } from 'react'
import { cloneElement, forwardRef, useEffect, useImperativeHandle } from 'react'
import { addTransitionClass, delTransitionClass } from '../utils/classnames'
import reflow from '../utils/reflow'
import { APPEAR, ENTER, EXIT, isAppear, isExit } from '../constants/status'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEvent from './hooks/use_transition_event'
import useTransitionStore from './hooks/use_transition_store'

import type { CSSTransitionProps, CSSTransitionRef, TransitionStep } from './props'

function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>,
  ref: Ref<CSSTransitionRef<E>>
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

  if (store.isInitial && ssr) reflow()

  const classes = useFormatClassNames(name, classNames)

  const timeouts = useFormatTimeouts(duration)

  useImperativeHandle(ref, () => store, [store])

  const [runCancel, makeEndHook, done] = useTransitionEvent(store, classes, props)

  const refCallback = useEvent((el: E | null) => {
    store.instance = el

    const original = (children as ReactElement & { ref: Ref<any> }).ref

    if (isFunction(original)) original(el)
    else if (isObject(original)) (original as any).current = el

    store.prepareHidden()

    if (store.appear || !when) store.hidden()
  })

  const runTransition = useEvent((el: E, step: TransitionStep) => {
    store.start(step)

    if (isExit(step)) onExit && onExit(el)
    else onEnter && onEnter(el, isAppear(step))

    const { from, active, to } = classes[step]

    addTransitionClass(el, from)

    isExit(step) && reflow(el)

    addTransitionClass(el, active)

    /** ================== Entering / Exiting =================== */

    reflow(el)

    if (isExit(step)) onExiting && onExiting(el)
    else onEntering && onEntering(el, isAppear(step))

    delTransitionClass(el, from)

    addTransitionClass(el, to)

    // 保存结束时的回调
    store.endHook = addEndListener
      ? addEndListener(el, step, done.bind(null, el, step))
      : makeEndHook(el, step, timeouts[step])

    return () => {
      store.runEndHook()

      store.running && runCancel(el, step)
    }
  })

  useEffect(() => {
    const { isInitial, instance } = store

    if (isInitial) store.isInitial = false

    if (!(instance && store.shouldTransition(isInitial, when))) return

    if (!isInitial) return runTransition(instance, when ? ENTER : EXIT)

    if (store.appear && when) return runTransition(instance, APPEAR)
  }, [runTransition, store, when])

  return !when && store.unmount ? null : cloneElement(children, { ref: refCallback })
}

export default forwardRef(CSSTransition)

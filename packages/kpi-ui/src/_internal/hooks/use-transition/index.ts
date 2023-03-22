/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { useEffect, useRef, useState } from 'react'
import { isFunction, isNumber, useConstant, useEvent } from '@kpi/shared'
import { ENTER, ENTERED, ENTERING, EXIT, EXITED, EXITING, UNMOUNTED, noop } from '../../constant'

import type { TransitionStatus } from '../../constant'

export interface TransitionOptions {
  timeout: number | { appear?: number; enter?: number; exit?: number }
  appear?: boolean
  enter?: boolean
  exit?: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  // 由原来分散的事件转为单一事件处理函数
  onChange?: (status: TransitionStatus, appearing: boolean) => void
}

function getTimeouts(timeout: TransitionOptions['timeout']) {
  if (isNumber(timeout)) {
    const exit = timeout
    const enter = timeout
    const appear = timeout
    return { exit, enter, appear }
  }
  const exit = timeout?.exit
  const enter = timeout?.enter
  const appear = timeout?.appear ?? enter

  return { exit, enter, appear }
}

const nextTick = (callback: () => void, timeout = 0) => {
  const id = setTimeout(callback, timeout)

  return () => clearTimeout(id)
}

// 该值不稳定 需要使用 react 自身的调度方式
const oneFrame = 16.667

export default function useTransition(open: boolean, options: TransitionOptions) {
  const {
    timeout,
    mountOnEnter = false,
    unmountOnExit = false,
    enter = true,
    exit = true,
    onChange = noop,
  } = options

  const timeouts = getTimeouts(timeout)

  const appear = useConstant(() => !!options.appear)

  const [status, setStatus] = useState<TransitionStatus>(() => {
    if (open) return appear ? EXITED : ENTERED
    return unmountOnExit || mountOnEnter ? UNMOUNTED : EXITED
  })

  const cancel = useRef(noop)

  const prev = useRef(status)

  // 更新状态值
  const updateStatus = useEvent((next: TransitionStatus, appearing: boolean, duration?: number) => {
    cancel.current()
    // 排除 enter 与 exit
    if (next !== ENTER && next !== EXIT) setStatus(next)

    const unmounted = prev.current === UNMOUNTED

    prev.current = next

    if (next !== UNMOUNTED) onChange(next, appearing)

    if (next === ENTER) {
      const $next = enter ? ENTERING : ENTERED
      cancel.current = nextTick(() => updateStatus($next, appearing, duration), oneFrame)
    } else if (next === EXIT) {
      const $next = exit ? EXITING : EXITED
      cancel.current = nextTick(() => updateStatus($next, appearing, duration), oneFrame)
    } else if (next === ENTERING) {
      if (unmountOnExit || mountOnEnter) {
        // reflow
      }
      cancel.current = nextTick(() => updateStatus(ENTERED, appearing), duration)
    } else if (next === EXITING) {
      cancel.current = nextTick(() => updateStatus(EXITED, appearing), duration)
    } else if (next === EXITED) {
      if (unmounted && open) {
        cancel.current = nextTick(() => updateStatus(ENTER, appearing, duration))
      } else if (unmountOnExit) {
        cancel.current = nextTick(() => updateStatus(UNMOUNTED, appearing))
      }
    }
  })

  const performEnter = useEvent((appearing: boolean) => {
    if (appearing && !(open && appear)) return

    const duration = appearing ? timeouts.appear : timeouts.enter

    const next = prev.current === UNMOUNTED && open ? EXITED : ENTER

    updateStatus(next, appearing, duration)
  })

  const performExit = useEvent(() => updateStatus(EXIT, false, timeouts.exit))

  const first = useRef(true)

  useEffect(() => {
    const isFirst = first.current
    first.current = false

    if (isFirst) return performEnter(true)

    return open ? performEnter(false) : performExit()
  }, [appear, open, performEnter, performExit])

  // cleanup raf
  useEffect(() => cancel.current, [])

  return { status, mounted: status !== UNMOUNTED }
}

/**
 * 能否像 framer-motion 与 react-spring 一样呢
 * 执行动画时不会引起额外的 re-render ？
 */

export function useTransition2(open: boolean, options: TransitionOptions) {
  //
  const { unmountOnExit, mountOnEnter } = options
  //
  const [status, setStatus] = useState(() => {
    return (unmountOnExit || mountOnEnter) && !open
  })
}

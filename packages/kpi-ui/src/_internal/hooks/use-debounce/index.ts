import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'

import type { ArrowFunction } from '../../types'

// 防抖 函数
export function debounce<Fn extends Function | ArrowFunction>(fn: Fn, delay = 100) {
  let timer: null | number = null
  return function inner(this: unknown, ...args: any[]) {
    if (timer !== null) clearTimeout(timer)
    timer = window.setTimeout(() => {
      ;(fn as Function).apply(this, args)
      timer = null
    }, delay)
  } as Fn
}

// 防抖 hook
export function useDebounceCallback<Fn extends Function>(delay: number, fn: Fn) {
  const callback = useEvent(fn as any)

  return useMemo<Fn>(() => debounce(callback, delay), [callback, delay])
}

// 防抖 value
export function useDebounceValue<Value = any>(delay: number, value: Value) {
  const [state, setState] = useState(value)

  const mounted = useMounted()

  const callback = useDebounceCallback(delay, () => {
    mounted.current && setState(value)
  })

  useEffect(callback, [callback, value])

  return state
}

export function useDebounceState<S = undefined>(delay: number, initialState: S | (() => S)) {
  const [state, setState] = useState(initialState)

  const throttledState = useDebounceValue(delay, state)

  return [throttledState, setState] as const
}

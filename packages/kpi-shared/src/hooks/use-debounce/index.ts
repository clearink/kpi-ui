import { useEffect, useMemo, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'

import type { AnyFunction } from '../../types'

// 防抖 函数
export function debounce(fn: (...args: any[]) => any, delay: number) {
  let timer: undefined | number

  function inner(this: unknown, ...args: any[]) {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn.apply(this, args), delay)
  }

  return [inner, () => clearTimeout(timer)] as const
}

// 防抖 hook
export function useDebounceCallback<Fn extends AnyFunction>(delay: number, fn: Fn) {
  const callback = useEvent(fn)

  const [debounced, clear] = useMemo(() => debounce(callback, delay), [callback, delay])

  // 自动清除定时器
  useEffect(() => clear, [clear])

  return debounced
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
  const [state, set] = useState(initialState)

  const setState = useDebounceCallback(delay, set)

  return [state, setState] as const
}

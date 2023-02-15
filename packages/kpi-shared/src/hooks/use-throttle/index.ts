import { useEffect, useMemo, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'
import { isUndefined } from '../../utils'

import type { AnyFunction } from '../../types'

// 节流 函数
export function throttle(fn: (...args: any[]) => any, delay: number) {
  let timer: undefined | number

  function inner(this: unknown, ...args: any[]) {
    if (!isUndefined(timer)) return

    timer = window.setTimeout(() => {
      timer = undefined
      fn.apply(this, args)
    }, delay)
  }

  return [inner, () => clearTimeout(timer)] as const
}

// 节流 hook
export function useThrottleCallback<Fn extends AnyFunction>(delay: number, fn: Fn) {
  const callback = useEvent(fn)

  const [throttled, clear] = useMemo(() => throttle(callback, delay), [callback, delay])

  // 自动清除定时器
  useEffect(() => clear, [clear])

  return throttled
}

// 节流 value
export function useThrottleValue<Value = any>(delay: number, value: Value) {
  const [state, setState] = useState(value)

  const mounted = useMounted()

  const callback = useThrottleCallback(delay, () => {
    mounted() && setState(value)
  })

  useEffect(callback, [callback, value])

  return state
}

export function useThrottleState<S = undefined>(delay: number, initialState: S | (() => S)) {
  const [state, set] = useState(initialState)

  const setState = useThrottleCallback(delay, set)

  return [state, setState] as const
}

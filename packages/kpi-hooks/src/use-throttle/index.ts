import { noop, makeFrameTimeout } from '@kpi-ui/utils'
import { useEffect, useMemo, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'
// types
import type { AnyFn } from '@kpi-ui/types'

// 节流 函数
export function throttle<F extends AnyFn>(fn: F, delay: number) {
  let cleanup = noop

  function inner(this: unknown, ...args: any[]) {
    if (cleanup !== noop) return

    // prettier-ignore
    const callback = () => { cleanup = noop; fn.apply(this, args) }

    cleanup = makeFrameTimeout(callback, delay)
  }

  // prettier-ignore
  return [inner, () => { cleanup() }] as const
}

// 节流 hook
export function useThrottleTimeout<Fn extends AnyFn>(delay: number, fn: Fn) {
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

  // prettier-ignore
  const callback = useThrottleTimeout(delay, () => { mounted() && setState(value) })

  useEffect(callback, [callback, value])

  return state
}

export function useThrottleState<S = undefined>(delay: number, initialState: S | (() => S)) {
  const [state, set] = useState(initialState)

  const setState = useThrottleTimeout(delay, set)

  return [state, setState] as const
}

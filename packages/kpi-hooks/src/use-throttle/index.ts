import { isUndefined } from '@kpi-ui/utils'
import { useEffect, useMemo, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'
// types
import type { AnyFn } from '@kpi-ui/types'

// 节流 函数
export function throttle(fn: AnyFn, delay: number) {
  let timer: undefined | number | NodeJS.Timeout

  function inner(this: unknown, ...args: any[]) {
    if (!isUndefined(timer)) return

    // prettier-ignore
    const callback = () => { timer = undefined; fn.apply(this, args) }

    timer = setTimeout(callback, delay)
  }

  return [inner, () => clearTimeout(timer)] as const
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

import { makeFrameTimeout } from '@kpi-ui/utils'
import { useEffect, useMemo, useState } from 'react'
import { useEvent } from '../use-event'
import { useMounted } from '../use-mounted'
// types
import type { AnyFn } from '@kpi-ui/types'

// 防抖 函数
export function debounce<F extends AnyFn>(fn: F, delay: number) {
  let cleanup = () => {}

  function inner(this: unknown, ...args: any[]) {
    cleanup()

    // prettier-ignore
    cleanup = makeFrameTimeout(delay, () => { fn.apply(this, args) })
  }

  // prettier-ignore
  return [inner as F, () => { cleanup() }] as const
}

// 防抖 hook
export function useDebounceTimeout<F extends AnyFn>(delay: number, fn: F) {
  const callback = useEvent(fn)

  const [debounced, clear] = useMemo(() => debounce(callback, delay), [callback, delay])

  // 自动清除定时器
  useEffect(() => clear, [clear])

  return debounced
}

// 防抖 value
export function useDebounceValue<Value>(delay: number, value: Value) {
  const [state, setState] = useState(value)

  const mounted = useMounted()

  // prettier-ignore
  const callback = useDebounceTimeout(delay, () => { mounted() && setState(value) })

  useEffect(callback, [callback, value])

  return state
}

export function useDebounceState<S>(delay: number, initialState: S | (() => S)) {
  const [state, set] = useState(initialState)

  const setState = useDebounceTimeout(delay, set)

  return [state, setState] as const
}

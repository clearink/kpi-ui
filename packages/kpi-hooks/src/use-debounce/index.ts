import { useEffect, useMemo, useState } from 'react'
import useEvent from '../use-event'
import useMounted from '../use-mounted'

type Fn = (...args: any[]) => any

// 防抖 函数
export function debounce<F extends Fn>(fn: F, delay: number) {
  let timer: undefined | number

  function inner(this: unknown, ...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay) as unknown as number
  }

  return [inner as F, () => clearTimeout(timer)] as const
}

// 防抖 hook
export function useDebounceCallback<F extends Fn>(delay: number, fn: F) {
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

  const callback = useDebounceCallback(delay, () => {
    mounted() && setState(value)
  })

  useEffect(callback, [callback, value])

  return state
}

export function useDebounceState<S>(delay: number, initialState: S | (() => S)) {
  const [state, set] = useState(initialState)

  const setState = useDebounceCallback(delay, set)

  return [state, setState] as const
}

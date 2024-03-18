import { useEffect, useRef } from 'react'
import { useEvent } from '../..'
// types
import type { AnyFn } from '@kpi-ui/types'

export interface SchedulerOptions<T> {
  initialValue: T
  onCleanup: (value: T) => any
  onScheduler: (callback: () => any) => T
  shouldReturn: (value: T) => boolean
}

export default function makeSchedulerHook<Fn extends AnyFn, T>(options: SchedulerOptions<T>) {
  const { initialValue, onCleanup, shouldReturn, onScheduler } = options

  return (callback: Fn) => {
    const ref = useRef(initialValue)

    // prettier-ignore
    useEffect(() => { onCleanup(ref.current) }, [])

    return useEvent((...args: any[]) => {
      if (shouldReturn(ref.current)) return

      // prettier-ignore
      ref.current = onScheduler(() => { ref.current = initialValue; callback(...args) })
    }) as Fn
  }
}

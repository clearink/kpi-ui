import { useEffect, useRef } from 'react'
import { useEvent } from '../..'
// types
import type { AnyFn } from '@kpi-ui/types'

export interface SchedulerOptions<T> {
  initialValue: T
  onCleanup: (value: T) => any
  onScheduler: (callback: () => any) => T
  shouldPrevent: (value: T) => boolean
}

export default function makeSchedulerHook<Fn extends AnyFn, T>(options: SchedulerOptions<T>) {
  const { initialValue, onCleanup, shouldPrevent, onScheduler } = options

  return (callback: Fn) => {
    const ref = useRef(initialValue)

    // prettier-ignore
    useEffect(() => { onCleanup(ref.current) }, [])

    return useEvent((...args: any[]) => {
      if (shouldPrevent(ref.current)) return

      // prettier-ignore
      ref.current = onScheduler(() => { ref.current = initialValue; callback(...args) })
    }) as Fn
  }
}

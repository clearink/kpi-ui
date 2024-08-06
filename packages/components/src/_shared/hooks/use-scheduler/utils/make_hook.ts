import type { AnyFn } from '@internal/types'

import { useEffect, useRef } from 'react'

import { useEvent } from '../../use-event'

export interface SchedulerOptions<T> {
  initialValue: T
  onCleanup: (value: T) => any
  onScheduler: (callback: () => any) => T
  shouldPrevent: (value: T) => boolean
}

export default function makeSchedulerHook<Fn extends AnyFn, T>(options: SchedulerOptions<T>) {
  const { initialValue, onCleanup, onScheduler, shouldPrevent } = options

  return (callback: Fn) => {
    const ref = useRef(initialValue)

    useEffect(() => () => { onCleanup(ref.current) }, [])

    return useEvent((...args: any[]) => {
      if (shouldPrevent(ref.current)) return

      ref.current = onScheduler(() => { ref.current = initialValue; callback(...args) })
    }) as Fn
  }
}

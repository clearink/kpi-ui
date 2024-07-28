import { isFunction, shallowEqual } from '@internal/utils'
import { useMemo, useRef } from 'react'

export interface WatchOptions<S> {
  compare: (current: S, previous: S) => boolean
  listener: (current: S, previous: S) => boolean | void
}

function useWatchValue<S>(current: S, args: WatchOptions<S>): boolean
function useWatchValue<S>(current: S, args: WatchOptions<S>['listener']): boolean
function useWatchValue<S>(current: S, args: any): boolean {
  const ref = useRef(current)

  // 兼容 react devtool
  return useMemo(() => {
    const compare = isFunction(args) ? shallowEqual : args.compare

    if (compare(current, ref.current)) return false

    const listener = isFunction(args) ? args : args.listener

    const returnEarly = listener(current, ref.current)

    ref.current = current

    return !!returnEarly
  }, [args, current])
}

export { useWatchValue }

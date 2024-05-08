import { isFunction, shallowEqual } from '@kpi-ui/utils'
import { useMemo, useRef } from 'react'

export interface WatchOptions<S> {
  compare: (current: S, previous: S) => boolean
  listener: (current: S, previous: S) => void
}

function useWatchValue<S>(current: S, args: WatchOptions<S>): void
function useWatchValue<S>(current: S, args: WatchOptions<S>['listener']): void
function useWatchValue<S>(current: S, args: any): void {
  const ref = useRef(current)

  // 兼容 react devtool
  useMemo(() => {
    const compare = isFunction(args) ? shallowEqual : args.compare

    if (compare(current, ref.current)) return

    const listener = isFunction(args) ? args : args.listener

    listener(current, ref.current)

    ref.current = current
  }, [args, current])
}

export default useWatchValue

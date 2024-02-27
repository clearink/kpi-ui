import { isFunction, shallowEqual } from '@kpi-ui/utils'
import { useRef } from 'react'

export interface WatchOptions<S> {
  compare: (current: S, previous: S) => boolean
  listener: (current: S, previous: S) => void
}

function useWatchValue<S>(current: S, callback: WatchOptions<S>['listener']): void
function useWatchValue<S>(current: S, options: WatchOptions<S>): void
function useWatchValue<S>(current: S, arg: WatchOptions<S> | WatchOptions<S>['listener']): void {
  const ref = useRef(current)

  const compare = isFunction(arg) ? shallowEqual : arg.compare

  if (compare(current, ref.current)) return

  isFunction(arg) ? arg(current, ref.current) : arg.listener(current, ref.current)

  ref.current = current
}

export default useWatchValue

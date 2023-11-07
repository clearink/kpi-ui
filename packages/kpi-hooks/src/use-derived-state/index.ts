import { isFunction } from '@kpi-ui/utils'
import { useRef } from 'react'

export interface DerivedOptions<S> {
  compare: (current: S, previous: S) => boolean
  listener: () => void
}

const shallowEqual = (a: any, b: any) => a === b

function useDerivedState<S>(current: S, callback: () => void): void
function useDerivedState<S>(current: S, options: DerivedOptions<S>): void
function useDerivedState<S>(current: S, arg: DerivedOptions<S> | (() => void)): void {
  const ref = useRef(current)

  const compare = isFunction(arg) ? shallowEqual : arg.compare

  const listener = isFunction(arg) ? arg : arg.listener

  if (compare(current, ref.current)) return

  listener()

  ref.current = current
}

export default useDerivedState

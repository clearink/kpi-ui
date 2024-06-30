import { shallowEqual } from '@kpi-ui/utils'
import { useMemo } from 'react'
import { useConstant } from '../use-constant'

export function usePrevious<T>(value: T) {
  const state = useConstant(() => ({
    current: undefined as T | undefined,
    previous: undefined as T | undefined,
  }))

  useMemo(() => {
    if (shallowEqual(state.current, value)) return
    state.previous = state.current
    state.current = value
  }, [state, value])

  return state.previous
}

import { shallowUnequal } from '@kpi-ui/utils'
import useConstant from '../use-constant'

export default function usePrevious<T>(value: T) {
  const state = useConstant(() => ({
    current: undefined as T | undefined,
    previous: undefined as T | undefined,
  }))

  if (shallowUnequal(state.current, value)) {
    state.previous = state.current
    state.current = value
  }

  return state.previous
}

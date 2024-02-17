import { shallowUnequal } from '@kpi-ui/utils'
import useConstant from '../use-constant'

export default function usePrevious<T>(value: T) {
  const store = useConstant(() => ({
    current: undefined as T | undefined,
    previous: undefined as T | undefined,
  }))

  if (shallowUnequal(store.current, value)) {
    store.previous = store.current
    store.current = value
  }

  return store.previous
}

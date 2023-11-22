import useConstant from '../use-constant'

export default function usePrevious<T>(value: T) {
  const store = useConstant(() => ({ value, previous: value }))

  if (store.value !== value) {
    store.previous = store.value
    store.value = value
  }

  return store.previous
}

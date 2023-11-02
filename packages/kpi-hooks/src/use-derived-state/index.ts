import { useRef } from 'react'

export default function useDerivedState<S>(current: S, callback: () => void) {
  const ref = useRef(current)

  if (ref.current === current) return

  callback()

  ref.current = current
}

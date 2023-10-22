import { useRef } from 'react'

export default function useWatch<S>(current: S, callback: (newVal: S, oldVal: S) => void) {
  const ref = useRef(current)

  if (ref.current === current) return

  callback(current, ref.current)

  ref.current = current
}

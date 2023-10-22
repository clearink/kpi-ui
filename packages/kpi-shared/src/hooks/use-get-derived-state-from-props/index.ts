import { useState } from 'react'

export default function useGetDerivedStateFromProps<S>(current: S, callback: () => void) {
  const [state, setState] = useState(current)

  if (state === current) return

  setState(current)

  callback()
}

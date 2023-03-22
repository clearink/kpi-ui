import { useRef } from 'react'

export default function useConstant<T>(init: () => T): T {
  const ref = useRef<{ used: boolean; cache: T | null }>({ used: false, cache: null })

  if (!ref.current.used) ref.current = { used: true, cache: init() }

  return ref.current.cache!
}

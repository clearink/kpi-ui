import { useEffect } from 'react'
import useEvent from '../use-event'

import type { AnyFunction } from '../../types'

export default function useUnmountEffect(callback: AnyFunction) {
  // keep callback new
  const handler = useEvent(callback)

  useEffect(() => handler, [handler])
}

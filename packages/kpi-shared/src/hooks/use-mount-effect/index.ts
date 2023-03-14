import { useEffect } from 'react'
import useEvent from '../use-event'

import type { AnyFunction } from '../../types'

export default function useMountEffect(callback: AnyFunction) {
  const handler = useEvent(callback)
  // eslint-disable-next-line no-sequences
  useEffect(() => (handler(), undefined), [handler])
}

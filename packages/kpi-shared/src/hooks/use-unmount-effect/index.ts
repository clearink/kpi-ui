import { useEffect } from 'react'
import useEvent from '../use-event'

export default function useUnmountEffect(callback: VoidFunction) {
  // keep callback new
  const handler = useEvent(callback)

  useEffect(() => handler, [handler])
}

import { useEvent, useUnmountEffect } from '@kpi-ui/hooks'
import { useRef } from 'react'

export default function useRafCallback<F extends (...args: any[]) => void>(fn: F) {
  const id = useRef(-1)

  useUnmountEffect(() => cancelAnimationFrame(id.current))

  return useEvent((...args: any[]) => {
    cancelAnimationFrame(id.current)

    id.current = requestAnimationFrame(() => fn(...args))
  })
}

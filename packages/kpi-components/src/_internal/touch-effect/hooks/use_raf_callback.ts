import { useEvent, useUnmountEffect } from '@kpi-ui/hooks'
import { caf, raf } from '@kpi-ui/utils'
import { useRef } from 'react'
// types
import type { AnyFn } from '@kpi-ui/types'

export default function useRafCallback<F extends AnyFn>(fn: F) {
  const id = useRef(-1)

  // prettier-ignore
  useUnmountEffect(() => { caf(id.current) })

  return useEvent((...args: any[]) => {
    caf(id.current)

    // prettier-ignore
    id.current = raf(() => { fn(...args) })
  })
}

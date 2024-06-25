import { getTargetElement, type GetTargetElement } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import { useEvent } from '../use-event'
// types
import type { MayBe } from '@kpi-ui/types'

export default function useClickOutside<T extends Element>(
  target: GetTargetElement<T>,
  handler: (event: PointerEvent | FocusEvent) => void
) {
  const callback = useEvent(handler)

  const [el, set] = useState<MayBe<T>>(null)

  // prettier-ignore
  useEffect(() => { set(getTargetElement(target)) }, [target])

  useEffect(() => {
    if (!el) return

    // TODO...
  }, [el, callback])
}

import type { MayBe } from '@kpi-ui/types'

import { type GetTargetElement, getTargetElement, observe } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'

import { useEvent } from '../use-event'

export function useResizeObserver<T extends Element>(
  target: GetTargetElement<T>,
  handler: (el: Element) => void,
) {
  const callback = useEvent(handler)

  const [el, set] = useState<MayBe<T>>(null)

  useEffect(() => { set(getTargetElement(target)) }, [target])

  useEffect(() => (el ? observe(el, callback) : undefined), [el, callback])
}

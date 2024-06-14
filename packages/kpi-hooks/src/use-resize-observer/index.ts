import { getTargetElement, observe, type GetTargetElement } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import useEvent from '../use-event'
// types
import type { MayBe } from '@kpi-ui/types'

export default function useResizeObserver<T extends Element>(
  target: GetTargetElement<T>,
  handler: (el: Element) => void
) {
  const callback = useEvent(handler)

  const [el, set] = useState<MayBe<T>>(null)

  // prettier-ignore
  useEffect(() => { set(getTargetElement(target)) }, [target])

  useEffect(() => (el ? observe(el, callback) : void 0), [el, callback])
}

import { noop } from '@kpi-ui/utils'
import useDeepMemo from '../use-deep-memo'
import useEvent from '../use-event'
import useIsomorphicEffect from '../use-isomorphic-effect'

import { type RefObject } from 'react'

export default function useDomEvent(
  ref: RefObject<EventTarget>,
  eventName: string,
  handler: EventListener = noop,
  options?: AddEventListenerOptions
) {
  const fn = useEvent(handler)

  const eventOptions = useDeepMemo(() => options, [options])

  useIsomorphicEffect(() => {
    const element = ref.current!

    if (!ref.current) return

    element.addEventListener(eventName, fn, eventOptions)

    return () => element.removeEventListener(eventName, fn, eventOptions)
  }, [fn, eventName, eventOptions, ref])
}

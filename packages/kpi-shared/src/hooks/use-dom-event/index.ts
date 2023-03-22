import type { RefObject } from 'react'
import { noop } from '../../utils'
import useDeepMemo from '../use-deep-memo'
import useEvent from '../use-event'
import useIsomorphicEffect from '../use-isomorphic-effect'

export default function useDomEvent(
  ref: RefObject<EventTarget>,
  eventName: string,
  handler: EventListener = noop,
  options?: AddEventListenerOptions
) {
  const eventHandler = useEvent(handler)

  const eventOptions = useDeepMemo(() => options, [options])

  useIsomorphicEffect(() => {
    const element = ref.current!

    if (!ref.current) return

    element.addEventListener(eventName, eventHandler, eventOptions)

    return () => element.removeEventListener(eventName, eventHandler, eventOptions)
  }, [eventHandler, eventName, eventOptions, ref])
}

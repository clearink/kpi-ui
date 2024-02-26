import { noop } from '@kpi-ui/utils'
import { useEffect, type RefObject } from 'react'
import useDeepMemo from '../use-deep-memo'
import useEvent from '../use-event'

export default function useDomEvent(
  ref: RefObject<EventTarget>,
  eventName: string,
  handler: EventListener = noop,
  options?: AddEventListenerOptions
) {
  const fn = useEvent(handler)

  const eventOptions = useDeepMemo(() => options, [options])

  useEffect(() => {
    const element = ref.current!

    if (!ref.current) return

    element.addEventListener(eventName, fn, eventOptions)

    // prettier-ignore
    return () => { element.removeEventListener(eventName, fn, eventOptions) }
  }, [fn, eventName, eventOptions, ref])
}

import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { loopFrame, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { getScrollElements } from '../../utils/elements'
// types
import type { TooltipTriggerProps } from './props'

function TooltipTrigger(props: TooltipTriggerProps, ref: ForwardedRef<any>) {
  const { open, children, events, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  useResizeObserver(() => dom.current, onResize)

  const $trigger = useComposeRefs((children as any).ref, ref, dom)

  useEffect(() => {
    if (!dom.current || !open) return

    const elements = getScrollElements(dom.current)

    const cleanupFrame = loopFrame(() => {
      elements.forEach((el) => {
        el.addEventListener('scroll', onScroll, { passive: true })
      })
    })

    return () => {
      cleanupFrame()

      // prettier-ignore
      elements.forEach((el) => { el.removeEventListener('scroll', onScroll) })
    }
  }, [open, onScroll])

  return cloneElement(children, { ref: $trigger, ...events })
}

export default withDisplayName(forwardRef(TooltipTrigger), 'TooltipTrigger')

import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { getScrollElements } from '../../utils/element'
// types
import type { TooltipTriggerProps } from './props'

function TooltipTrigger(props: TooltipTriggerProps, ref: ForwardedRef<any>) {
  const { open, children, events, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  useResizeObserver(dom, onResize)

  useEffect(() => {
    if (!dom.current || !open) return

    const elements = getScrollElements(dom.current)

    elements.forEach((el) => {
      el.addEventListener('scroll', onScroll, { passive: true })
    })

    return () => {
      // prettier-ignore
      elements.forEach((el) => { el.removeEventListener('scroll', onScroll) })
    }
  }, [open, onScroll])

  const $trigger = useComposeRefs((children as any).ref, ref, dom)

  return cloneElement(children, { ref: $trigger, ...events })
}

export default withDisplayName(forwardRef(TooltipTrigger), 'TooltipTrigger')

import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { getScrollElements } from '../../utils/elements'
// types
import type { TooltipTriggerProps } from './props'

function TooltipTrigger(props: TooltipTriggerProps, _ref: ForwardedRef<any>) {
  const { open, children, events, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  useResizeObserver(dom, onResize)

  useEffect(() => {
    if (!dom.current || !open) return

    const elements = getScrollElements(dom.current)

    // prettier-ignore
    elements.forEach((el) => { el.addEventListener('scroll', onScroll, { passive: true }) })

    // prettier-ignore
    return () => { elements.forEach((el) => { el.removeEventListener('scroll', onScroll) }) }
  }, [open, onScroll])

  const ref = useComposeRefs((children as any).ref, _ref, dom)

  // TODO: 不能覆盖原有的 event
  return cloneElement(children, { ref, ...events })
}

export default withDisplayName(forwardRef(TooltipTrigger), 'TooltipTrigger')

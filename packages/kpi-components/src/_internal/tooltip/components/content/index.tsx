import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { ownerWindow, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { getScrollElements } from '../../utils/elements'
// types
import type { TooltipContentProps } from './props'

function TooltipContent(props: TooltipContentProps, _ref: ForwardedRef<any>) {
  const { open, children, onResize, onScroll, onMounted } = props

  const dom = useRef<Element>(null)

  useResizeObserver(dom, onResize)

  useEffect(() => onMounted(dom.current), [onMounted])

  useEffect(() => {
    if (!dom.current || !open) return

    const elements = new Set([...getScrollElements(dom.current), ownerWindow(dom.current)])

    // prettier-ignore
    elements.forEach((el) => { el.addEventListener('scroll', onScroll, { passive: true }) })

    // prettier-ignore
    return () => { elements.forEach((el) => { el.removeEventListener('scroll', onScroll) })}
  }, [open, onScroll])

  const ref = useComposeRefs((children as any).ref, _ref, dom)

  return cloneElement(children, { ref })
}

export default withDisplayName(forwardRef(TooltipContent), 'TooltipContent')

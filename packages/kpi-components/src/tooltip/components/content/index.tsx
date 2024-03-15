import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { loopFrame, ownerWindow, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { getScrollElements } from '../../utils/elements'
// types
import type { TooltipContentProps } from './props'

function TooltipContent(props: TooltipContentProps, ref: ForwardedRef<any>) {
  const { open, children, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  useResizeObserver(() => dom.current, onResize)

  const $content = useComposeRefs((children as any).ref, ref, dom)

  useEffect(() => {
    if (!dom.current || !open) return

    const elements = new Set([...getScrollElements(dom.current), ownerWindow(dom.current)])

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

  return cloneElement(children, { ref: $content })
}

export default withDisplayName(forwardRef(TooltipContent), 'TooltipContent')

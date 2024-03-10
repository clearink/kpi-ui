import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { addListener } from '../../../transition/_shared/utils'
import getScrollable from '../../utils/scrollable'
// types
import type { TooltipContentProps } from './props'
import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'

function TooltipContent(props: TooltipContentProps, ref: ForwardedRef<any>) {
  const { open, children, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  const $content = useComposeRefs((children as any).ref, ref, dom)

  useResizeObserver(dom, onResize)

  useEffect(() => {
    const el = dom.current

    if (!el || !open) return

    const removes: (() => void)[] = []

    getScrollable(el).forEach((el) => {
      removes.push(addListener(el, 'scroll', onScroll, { passive: true }))
    })

    // prettier-ignore
    return () => { removes.forEach((fn) => { fn() }) }
  }, [open, onScroll])

  return cloneElement(children, { ref: $content })
}

export default withDisplayName(forwardRef(TooltipContent), 'TooltipContent')

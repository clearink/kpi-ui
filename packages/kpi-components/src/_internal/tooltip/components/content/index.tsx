import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { ownerWindow, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { addListener } from '../../../transition/_shared/utils'
import getScrollable from '../../utils/scrollable'
// types
import type { TooltipContentProps } from './props'

function TooltipContent(props: TooltipContentProps, ref: ForwardedRef<any>) {
  const { open, children, onUpdate } = props

  const dom = useRef<Element>(null)

  useResizeObserver(dom, onUpdate)

  const $content = useComposeRefs((children as any).ref, ref, dom)

  useEffect(() => {
    const el = dom.current

    if (!el || !open) return

    const removes: (() => void)[] = []

    new Set([...getScrollable(el), ownerWindow(dom.current)]).forEach((el) => {
      removes.push(addListener(el, 'scroll', onUpdate, { passive: true }))
    })

    // prettier-ignore
    return () => { removes.forEach((fn) => { fn() }) }
  }, [open, onUpdate])

  return cloneElement(children, { ref: $content })
}

export default withDisplayName(forwardRef(TooltipContent), 'TooltipContent')

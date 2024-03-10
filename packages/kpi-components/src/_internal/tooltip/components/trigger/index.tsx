import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useRef, type ForwardedRef, useEffect } from 'react'
import getScrollable from '../../utils/scrollable'
import { addListener } from '../../../transition/_shared/utils'
// types
import type { TooltipTriggerProps } from './props'
import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'

function TooltipTrigger(props: TooltipTriggerProps, ref: ForwardedRef<any>) {
  const { open, children, events, onResize, onScroll } = props

  const dom = useRef<Element>(null)

  const $trigger = useComposeRefs((children as any).ref, ref, dom)

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

  return cloneElement(children, { ref: $trigger, ...events })
}

export default withDisplayName(forwardRef(TooltipTrigger), 'TooltipTrigger')

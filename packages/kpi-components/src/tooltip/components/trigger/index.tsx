import { useComposeRefs, useResizeObserver } from '@kpi-ui/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useEffect, useRef, type ForwardedRef } from 'react'
import { addListener } from '../../../_internal/transition/_shared/utils'
import { getScrollElements } from '../../utils/elements'
// types
import type { TooltipTriggerProps } from './props'

function TooltipTrigger(props: TooltipTriggerProps, ref: ForwardedRef<any>) {
  const { open, children, events, onUpdate } = props

  const dom = useRef<Element>(null)

  useResizeObserver(() => dom.current, onUpdate)

  const $trigger = useComposeRefs((children as any).ref, ref, dom)

  useEffect(() => {
    if (!dom.current || !open) return

    const removes: (() => void)[] = []

    getScrollElements(dom.current).forEach((el) => {
      removes.push(addListener(el, 'scroll', onUpdate, { passive: true }))
    })

    // prettier-ignore
    return () => { removes.forEach((fn) => { fn() }) }
  }, [open, onUpdate])

  return cloneElement(children, { ref: $trigger, ...events })
}

export default withDisplayName(forwardRef(TooltipTrigger), 'TooltipTrigger')

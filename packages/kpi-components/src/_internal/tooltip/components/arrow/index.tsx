import { mergeRefs, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef, useRef, type ForwardedRef } from 'react'
// comps
import ResizeObserver from '../../../resize-observer'
// types
import type { TooltipContentProps } from './props'

function TooltipContent(props: TooltipContentProps, ref: ForwardedRef<any>) {
  const { children, onResize } = props

  const dom = useRef<Element>(null)

  return (
    <ResizeObserver onResize={onResize}>
      {cloneElement(children, { ref: mergeRefs((children as any).ref, ref, dom) })}
    </ResizeObserver>
  )
}

export default withDisplayName(forwardRef(TooltipContent), 'TooltipContent')

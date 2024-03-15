import { useEffect, useRef } from 'react'
import useEvent from '../use-event'
import getObserveTarget from './utils/target'
import observe from './utils/observe'
import useForceUpdate from '../use-force-update'
// types
import type { GetTargetType, TargetType } from './props'

// 元素改变大小 observer hook
export default function useResizeObserver(target: GetTargetType, onResize: (el: Element) => void) {
  // prettier-ignore
  const onChange = useEvent(onResize)

  const el = useRef<TargetType>(null)

  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const newTarget = getObserveTarget(target)

    if (el.current !== newTarget) forceUpdate()

    el.current = newTarget
  }, [forceUpdate, target])

  const dom = el.current

  useEffect(() => (dom ? observe(dom, onChange) : undefined), [onChange, dom])
}

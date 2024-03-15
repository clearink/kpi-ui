import { useEffect } from 'react'
import useConstant from '../use-constant'
import useEvent from '../use-event'
import useForceUpdate from '../use-force-update'
import observe from './utils/observe'
import getObserveTarget from './utils/target'
// types
import type { GetTargetType, TargetType } from './props'

// 元素改变大小 observer hook
export default function useResizeObserver(target: GetTargetType, onResize: (el: Element) => void) {
  const onChange = useEvent(onResize)

  const store = useConstant(() => ({ el: null as TargetType }))

  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const newTarget = getObserveTarget(target)

    if (store.el !== newTarget) forceUpdate()

    store.el = newTarget
  }, [forceUpdate, store, target])

  useEffect(() => (store.el ? observe(store.el, onChange) : void 0), [onChange, store.el])
}

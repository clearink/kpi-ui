// uitls
import { ownerWindow } from '@kpi-ui/utils'
import { useEffect } from 'react'
import useEvent from '../use-event'

type ResizeCallback = (el: Element) => void

const __listeners = new Map<Element, Set<ResizeCallback>>()

const __observer = new ResizeObserver((entries) => {
  entries.forEach(({ target }) => {
    __listeners.get(target)?.forEach((fn) => fn(target))
  })
})

const __handleResize = () => {
  __listeners.forEach((listeners, el) => {
    listeners.forEach((fn) => fn(el))
  })
}
// 元素改变大小 observer hook
export default function useResizeObserver(
  dom: React.RefObject<Element>,
  onResize: (el: Element) => void
) {
  const fn = useEvent(onResize)

  useEffect(() => {
    const el = dom.current

    if (!el) return

    const callback = () => fn(el)

    if (__listeners.size === 0) {
      ownerWindow(el).addEventListener('resize', __handleResize)
    }

    if (!__listeners.has(el)) {
      __listeners.set(el, new Set())
      __observer.observe(el, { box: 'border-box' })
    }

    __listeners.get(el)?.add(callback)

    return () => {
      const listener = __listeners.get(el)

      listener?.delete(callback)

      if (listener && listener.size === 0) {
        __listeners.delete(el)
        __observer.unobserve(el)
      }

      if (__listeners.size === 0) {
        ownerWindow(el).removeEventListener('resize', __handleResize)
      }
    }
  }, [dom, fn])
}

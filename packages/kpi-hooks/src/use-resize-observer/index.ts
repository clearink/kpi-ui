import { ownerWindow } from '@kpi-ui/utils'
import { useEffect } from 'react'
import useEvent from '../use-event'

type ResizeCallback = (el: Element) => void

const __listeners = new Map<Element, Set<ResizeCallback>>()

const __observer = new ResizeObserver((entries) => {
  entries.forEach(({ target }) => {
    // prettier-ignore
    __listeners.get(target)?.forEach((fn) => { fn(target) })
  })
})

const __handleResize = () => {
  __listeners.forEach((listeners, el) => {
    // prettier-ignore
    listeners.forEach((fn) => { fn(el) })
  })
}

// 元素改变大小 observer hook
export default function useResizeObserver(
  dom: React.RefObject<Element>,
  onResize?: (el: Element) => void
) {
  const resizeEvent = useEvent((el: Element) => {
    onResize && onResize(el)
  })

  useEffect(() => {
    const el = dom.current

    if (!el) return

    if (__listeners.size === 0) {
      ownerWindow(el).addEventListener('resize', __handleResize, { passive: true })
    }

    if (!__listeners.has(el)) {
      __listeners.set(el, new Set())
      __observer.observe(el, { box: 'border-box' })
    }

    __listeners.get(el)?.add(resizeEvent)

    return () => {
      const listener = __listeners.get(el)

      listener?.delete(resizeEvent)

      if (listener && listener.size === 0) {
        __listeners.delete(el)
        __observer.unobserve(el)
      }

      if (__listeners.size === 0) {
        ownerWindow(el).removeEventListener('resize', __handleResize)
      }
    }
  }, [dom, resizeEvent])
}

import { ownerWindow } from '@kpi-ui/utils'
import useConstant from '../../use-constant'

type ResizeCallback = (el: Element) => void

export class ResizeStore {
  static __listeners = new Map<Element, Set<ResizeCallback>>()

  static __observer = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => {
      ResizeStore.__listeners.get(target)?.forEach((fn) => fn(target))
    })
  })

  observe = (el: Element, callback: ResizeCallback) => {
    const fn = () => callback(el)

    if (!ResizeStore.__listeners.size) {
      ownerWindow(el).addEventListener('resize', fn)
    }

    if (!ResizeStore.__listeners.has(el)) {
      ResizeStore.__listeners.set(el, new Set())
      ResizeStore.__observer.observe(el, { box: 'border-box' })
    }

    ResizeStore.__listeners.get(el)?.add(fn)

    return () => {
      const listener = ResizeStore.__listeners.get(el)

      listener?.delete(fn)

      if (listener && !listener.size) {
        ResizeStore.__listeners.delete(el)
        ResizeStore.__observer.unobserve(el)
      }

      if (!ResizeStore.__listeners.size) {
        ownerWindow(el).removeEventListener('resize', fn)
      }
    }
  }
}

export default function useResizeStore() {
  return useConstant(() => new ResizeStore())
}

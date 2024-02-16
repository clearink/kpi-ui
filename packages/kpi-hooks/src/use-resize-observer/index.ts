// uitls
import { useEffect } from 'react'
import useEvent from '../use-event'
import useResizeStore from './hooks/use_resize_store'

// 元素改变大小 observer hook
export default function useResizeObserver(
  dom: React.RefObject<Element>,
  onResize: (el: Element) => void
) {
  const fn = useEvent(onResize)

  const store = useResizeStore()

  useEffect(() => (dom.current ? store.observe(dom.current, fn) : undefined), [dom, fn, store])
}

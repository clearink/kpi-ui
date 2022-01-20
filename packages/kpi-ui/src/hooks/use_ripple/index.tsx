import { RefObject, useEffect, useRef } from 'react'
import Ripple from './ripple'
import './style.scss'
export interface useRippleProps {
  parentRef: RefObject<HTMLElement>
}
export default function useRipple<H extends HTMLElement>() {
  const ref = useRef<H>(null)
  // 事件
  useEffect(() => {
    const dom = ref.current
    if (!dom) return
    const instance = new Ripple(dom)
    dom.addEventListener('mousedown', (e) => {
      instance.createRipple(e)
    })
    // 取消事件
    ;['mouseup', 'mouseleave', 'contextmenu', 'blur'].forEach((eventName) => {
      dom.addEventListener(eventName, () => {
        instance.removeRipple()
      })
    })

    return () => instance.destroy()
  }, [])
  return ref
}
/**
 * const rippleHandlers = {
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onContextMenu: handleContextMenu,
      onDragLeave: handleDragLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    } as RippleEventHandlers;
 */

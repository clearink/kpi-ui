type EventMap = DocumentEventMap | HTMLElementEventMap | SVGElementEventMap | WindowEventMap

export function makeEventListener<E extends Node | Window, K extends keyof EventMap>(
  el: E,
  type: K,
  listener: (event: EventMap[K]) => any,
  options?: AddEventListenerOptions | boolean
) {
  el.addEventListener(type, listener as any, options)

  // prettier-ignore
  return () => { el.removeEventListener(type, listener as any, options) }
}

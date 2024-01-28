type EventMap = DocumentEventMap | HTMLElementEventMap | SVGElementEventMap | WindowEventMap

export function addListener<E extends Node, K extends keyof EventMap>(
  el: E,
  type: K,
  listener: (event: EventMap[K]) => any,
  options?: AddEventListenerOptions | boolean
) {
  el.addEventListener(type, listener as any, options)

  return () => el.removeEventListener(type, listener as any, options)
}

export function addTimeout(timeout: number, callback: (...args: any) => any) {
  const id = setTimeout(callback, timeout)

  return () => clearTimeout(id)
}

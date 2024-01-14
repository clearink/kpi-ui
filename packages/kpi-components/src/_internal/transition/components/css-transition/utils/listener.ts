export function addListener<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
  el: E,
  event: K,
  listener: (event: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  el.addEventListener(event, listener, options)

  return () => el.removeEventListener(event, listener, options)
}

export function addTimeout(timeout: number, callback: (...args: any) => any) {
  const id = setTimeout(callback, timeout)

  return () => clearTimeout(id)
}

export function addClassName(dom: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && dom.classList.add(c))
}
export function delClassName(dom: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && dom.classList.remove(c))
}

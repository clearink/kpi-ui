export function addTransitionClass(dom: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && dom.classList.add(c))
}
export function delTransitionClass(dom: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && dom.classList.remove(c))
}

export function addClassName(el: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c))
}
export function delClassName(el: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))
}

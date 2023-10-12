export function addTransitionClass(el: Element, ...classNames: string[]) {
  classNames.forEach((cls) => {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c))
  })
}
export function delTransitionClass(el: Element, ...classNames: string[]) {
  classNames.forEach((cls) => {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))
  })
}

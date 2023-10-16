export function addClassName(el: Element, ...classNames: (string | undefined)[]) {
  classNames.forEach((cls) => {
    ;(cls || '').split(/\s+/).forEach((c) => c && el.classList.add(c))
  })
}
export function delClassName(el: Element, ...classNames: (string | undefined)[]) {
  classNames.forEach((cls) => {
    ;(cls || '').split(/\s+/).forEach((c) => c && el.classList.remove(c))
  })
}

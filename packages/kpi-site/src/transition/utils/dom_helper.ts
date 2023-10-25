/* eslint-disable no-param-reassign */
export function addClassName(el: Element, ...classNames: (string | undefined)[]) {
  classNames.forEach((cls) => {
    if (!cls) return
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c))
  })
}
export function delClassName(el: Element, ...classNames: (string | undefined)[]) {
  classNames.forEach((cls) => {
    if (!cls) return
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))
  })
}

export function addInlineStyle(
  el: HTMLElement,
  property: keyof CSSStyleDeclaration,
  value: string
) {
  const original = el.style[property] as string

  el.style.setProperty(property as string, value)

  return () => {
    el.style.setProperty(property as string, original)
  }
}

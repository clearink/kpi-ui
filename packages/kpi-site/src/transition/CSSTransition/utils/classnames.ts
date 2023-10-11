export function addClassName(el: Element, ...classNames: string[]) {
  classNames.forEach((cls) => {
    cls.split(/\s+/).forEach((c) => {
      if (c) el.classList.add(c)
    })
  })
}
export function delClassName(el: Element, ...classNames: string[]) {
  classNames.forEach((cls) => {
    cls.split(/\s+/).forEach((c) => {
      if (c) el.classList.remove(c)
    })
  })
}

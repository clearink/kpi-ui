export function addTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    cls && cls.split(/\s+/).forEach((c) => c && el.classList.add(c))
  })
}

export function delTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    cls && cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))
  })
}

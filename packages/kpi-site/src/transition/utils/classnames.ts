const effectName = Symbol.for('effect-name')

export function addTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    if (!cls) return

    cls.split(/\s+/).forEach((c) => c && el.classList.add(c))

    const dom = el as Element & { [effectName]?: Set<string> }

    dom[effectName] = dom[effectName] || new Set<string>()

    dom[effectName].add(cls)
  })
}

export function delTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    if (!cls) return

    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))

    const dom = el as Element & { [effectName]?: Set<string> }

    if (!dom[effectName]) return

    dom[effectName].delete(cls)

    if (!dom[effectName].size) delete dom[effectName]
  })
}

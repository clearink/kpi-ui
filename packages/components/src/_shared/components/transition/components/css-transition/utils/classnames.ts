import { addClassNames, delClassNames } from '@kpi-ui/utils'

const additional = Symbol.for('additional-class')

export function addTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  const dom = el as { [additional]?: Set<string | undefined> } & Element

  addClassNames(dom, ...classes)

  if (!dom[additional]) dom[additional] = new Set()

  classes.forEach((cls) => { dom[additional]!.add(cls) })
}

export function delTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  const dom = el as { [additional]?: Set<string | undefined> } & Element

  delClassNames(dom, ...classes)

  if (dom[additional]) classes.forEach((cls) => { dom[additional]!.delete(cls) })
}

export function recoverTransitionClass(el: Element) {
  const dom = el as { [additional]?: Set<string | undefined> } & Element

  if (dom[additional]) dom[additional].forEach((cls) => { addClassNames(dom, cls) })
}

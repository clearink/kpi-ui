import { addClassNames, delClassNames } from '@kpi-ui/utils'

const additional = Symbol.for('additional-class')

export const addTransitionClass = (el: Element, ...classes: (string | undefined)[]) => {
  const dom = el as Element & { [additional]?: Set<string | undefined> }

  addClassNames(dom, ...classes)

  if (!dom[additional]) dom[additional] = new Set()

  classes.forEach((cls) => dom[additional]!.add(cls))
}

export const delTransitionClass = (el: Element, ...classes: (string | undefined)[]) => {
  const dom = el as Element & { [additional]?: Set<string | undefined> }

  delClassNames(dom, ...classes)

  if (dom[additional]) classes.forEach((cls) => dom[additional]!.delete(cls))
}

export const recoverTransitionClass = (el: Element) => {
  const dom = el as Element & { [additional]?: Set<string | undefined> }

  if (dom[additional]) dom[additional].forEach((cls) => addClassNames(dom, cls))
}

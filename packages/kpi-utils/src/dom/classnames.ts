// utils
import classNames from 'classnames'
// types
import type { ArgumentArray } from 'classnames'

export function addClassNames(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    cls && cls.split(/\s+/).forEach((c) => c && el.classList.add(c))
  })
}

export function delClassNames(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => {
    cls && cls.split(/\s+/).forEach((c) => c && el.classList.remove(c))
  })
}

export const cls = (...args: ArgumentArray) => classNames(...args) || undefined

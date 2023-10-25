import { addClassName, delClassName } from '../../utils/dom_helper'

export function addTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => cls && addClassName(el, cls))
}

export function delTransitionClass(el: Element, ...classes: (string | undefined)[]) {
  classes.forEach((cls) => cls && delClassName(el, cls))
}

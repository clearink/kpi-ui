// utils
import { TABBABLE_QUERY } from '../constants'

export default function getTabbable(el: HTMLElement) {
  const list = el.querySelectorAll<HTMLElement>(TABBABLE_QUERY)

  return Array.from(list)
}

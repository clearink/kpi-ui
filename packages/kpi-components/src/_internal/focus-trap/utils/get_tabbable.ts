// utils
import { TABBABLE_QUERY } from '../constants'

export default function getTabbable(el: HTMLElement) {
  return el.querySelectorAll<HTMLElement>(TABBABLE_QUERY)
}

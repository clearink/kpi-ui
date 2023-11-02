import { addTransitionClass, delTransitionClass, effectName } from '../../utils/classnames'
import collectTimeoutInfo from '../../utils/collect'

export default function shouldFlip(cls?: string, el?: HTMLElement | null) {
  const dom = el as (HTMLElement & { [effectName]?: Set<string> }) | null

  if (!cls || !dom) return false

  const clone = dom.cloneNode() as HTMLElement

  ;(dom[effectName] || []).forEach((str) => delTransitionClass(clone, str))

  addTransitionClass(clone, cls)

  clone.style.display = 'none'

  const container = dom.parentNode || document.body

  container.appendChild(clone)

  const collection = getComputedStyle(clone, null)

  const transition = collectTimeoutInfo(collection, 'transition')

  const animation = collectTimeoutInfo(collection, 'animation')

  const property = `${collection.transitionProperty || ''}`

  container.removeChild(clone)

  if (transition.timeout <= animation.timeout) return false

  return /\b(transform|all)(,|$)/.test(property)
}

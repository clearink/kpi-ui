import { isFunction } from '../is'
// types
import type { MayBe } from '@kpi-ui/types'

export function getShadowRoot(el: MayBe<Node>) {
  const root = el?.getRootNode?.()

  return root instanceof ShadowRoot ? root : null
}

export function inShadowNode(el: MayBe<Node>) {
  return getShadowRoot(el) instanceof ShadowRoot
}

// TODO
// export function attachedRoot(el: MayBe<Node>) {
//   if (!el) return null

//   if(!isFunction(el)){
//     while(el.parentNode) el = el?.parentNode
//   }
//   if(typeof el.getRootNode === 'function')
// }

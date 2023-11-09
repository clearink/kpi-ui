import { hasOwn } from '@kpi-ui/utils'
import { EffectSchema } from '../schema/base'

import type BaseSchema from '../schema/base'

export default function hasRequired(schema?: BaseSchema) {
  let tail = schema

  while (tail && hasOwn(tail, 'unwrap')) {
    if (!(tail instanceof EffectSchema)) break
    if (tail._type === 'required') return true
    if (tail._type === 'nullable') return false
    tail = tail.unwrap()
  }

  return false
}

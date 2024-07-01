import { isUndefined } from '@kpi-ui/utils'

import type BaseSchema from '../schema/base'
import { EffectSchema } from '../schema/base'

export default function hasRequired(schema?: BaseSchema) {
  let tail = schema

  let required: boolean | undefined

  while (tail instanceof EffectSchema) {
    if (tail._type === 'required' && isUndefined(required)) required = true
    else if (tail._type === 'nullable') required = false

    tail = tail.unwrap()
  }

  return !!required
}

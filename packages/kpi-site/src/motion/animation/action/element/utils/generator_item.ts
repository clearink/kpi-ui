import decompose from '../../../../utils/decompose'
import { defineGetter } from '../../../../utils/define'
import { normalizeTarget } from '../../value/utils/normalize'

import type { AnimatableValue } from '../../../interface'

// element animation 时需要不同的处理
export default class GeneratorItem<V extends AnimatableValue> {
  formatted!: ReturnType<typeof decompose>

  constructor(public original: V) {
    let $formatted: this['formatted']
    defineGetter(this, 'formatted', () => {
      if (!$formatted) $formatted = decompose(normalizeTarget(original))
      return $formatted
    })
  }
}

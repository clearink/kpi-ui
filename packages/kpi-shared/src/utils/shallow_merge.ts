import { isUndefined } from './is'

import type { AnyObject } from '../types'

export default function shallowMerge<R, T extends AnyObject>(target: R, source: T) {
  const shallow = { ...target }

  const keys = Object.keys(source)

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (isUndefined(shallow[key])) shallow[key] = source[key]
  }

  return shallow as R & T
}

import { isUndefined } from './is'

import type { AnyObject } from '../types'

export default function mergeSameNameProps<R, T extends AnyObject>(source: R, target: T) {
  const shallow = { ...source }
  for (const attr of Object.keys(target)) {
    const origin = shallow[attr]
    if (isUndefined(origin)) shallow[attr] = target[attr]
  }
  return shallow as R & T
}

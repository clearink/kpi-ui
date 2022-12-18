import { isUndefined } from './is'

import type { AnyObject } from '../types'

export default function mergeSameNameProps<R, T extends AnyObject>(target: R, source: T) {
  const shallow = { ...target }
  for (const attr of Object.keys(source)) {
    const origin = shallow[attr]
    if (isUndefined(origin)) shallow[attr] = source[attr]
  }
  return shallow as R & T
}

import { isString } from '@kpi/shared'
import color from '../../../../parse/color'
import angle from '../../../../parse/angle'

import type { AnimatableValue } from '../../../interface'

export default function resolveTarget<V extends AnimatableValue>(targets: V[]) {
  return targets.map((item) => {
    if (!isString(item)) return item

    if (color.test(item)) return color.transform(color.parse(item)) as V

    if (angle.test(item)) return angle.transform(angle.parse(item)) as V

    return item
  })
}

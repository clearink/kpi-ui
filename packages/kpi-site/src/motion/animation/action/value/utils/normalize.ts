/* eslint-disable import/prefer-default-export */
import { isString } from '@kpi/shared'
import angle from '../../../../prepare/angle'
import color from '../../../../prepare/color'
import { normalizeKeyframes } from '../../../utils/normalize'

import type { GenericKeyframes } from '../../../interface'

// TODO: 优化逻辑
export function normalizeTargets<V>(from: V, to: V | GenericKeyframes<V>) {
  return normalizeKeyframes(from, to).map((item) => {
    if (!isString(item)) return { original: item, formatted: item }

    if (color.test(item))
      return { original: item, formatted: color.transform(color.parse(item)) as V }

    if (angle.test(item))
      return { original: item, formatted: angle.render(angle.prepare(item)) as V }

    return { original: item, formatted: item }
  })
}

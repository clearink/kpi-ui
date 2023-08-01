import { isArray, isNull, isString, pushItem } from '@kpi/shared'
import angle from '../../../../prepare/angle'
import color from '../../../../prepare/color'

import type { GenericKeyframes } from '../../../interface'

export function normalizeKeyframes<V>(from: V, to: V | GenericKeyframes<V>) {
  const targets = isArray(to) ? to : [null, to]

  return targets.reduce((result: V[], target, i) => {
    if (!isNull(target)) return pushItem(result, target)

    return pushItem(result, i === 0 ? from : result[i - 1])
  }, [])
}

// 只解析 color, angle 形式的字符串
export function normalizeTarget<V>(target: V) {
  if (!isString(target)) return target

  if (color.test(target)) return color.transform(color.parse(target)) as V

  if (angle.test(target)) return angle.render(angle.prepare(target)) as V

  return target
}

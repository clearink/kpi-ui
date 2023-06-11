import { hasOwn, isNull, toArray } from '@kpi/shared'
import units from '../../config/units'
import { motionValue } from '../../../motion'
import { convertToUnit } from '../../../prepare'
import transform from '../../../prepare/transform'
import { motionTransformProps } from '../../../prepare/transform/misc'
import getUnit from '../../../prepare/utils/get_unit'
import { pushItem } from '../../../utils/array'
import defineHidden from '../../../utils/define_hidden'
import { $cache } from '../../../utils/symbol'
import {
  resolveElementAttribute,
  resolveElementStyle,
  resolveElementTransform,
} from '../../utils/resolve'
import createTweenRenderer from '../value/renderer'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'
import type { TweenRenderer } from '../../scheduler'

export default function createElementsRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  // prepare 事先将 keyframes 解析成符合要求的部分, 比如简写换成全写等.
  const res = elements.reduce((result: TweenRenderer[], element) => {
    // 1. 给 element 添加 cache 属性
    // 2. 解析 keyframes 生成 renderers
    // 3. 如何监听update 事件自动更新视图? 当然是创建 motionValue 时监听一个 update 事件了.

    // 1. 默认值, 单位, 渲染函数

    return result
  }, [])

  console.log(elements)

  return res
}

/* eslint-disable import/prefer-default-export */

import { isNull, isNumber } from '@kpi/shared'
import units from '../../../config/units'

import type { AnimatableValue, KeyframeTarget } from '../../../interface'

export function getUnit(value: AnimatableValue) {
  if (isNumber(value)) return null

  const reg =
    /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)$/

  const match = value.match(reg)

  return match ? match[1] : null
}

function isSvgElement(element: any): element is SVGElement {
  return element instanceof SVGElement
}

function isHTMLElement(element: any): element is HTMLElement {
  return element instanceof HTMLElement
}

export function convertUnit<V extends AnimatableValue>(
  element: Element,
  property: string,
  to: KeyframeTarget
) {
  // if (element.nodeType) {
  //   const targets = to.map((item) => ({ unit: getUnit(item) ?? (units[property] || 'px'), item }))
  //   // 讨论是否为svg了
  //   // 原始值
  //   const original = element.style.getPropertyValue()
  //   // 最终目标的 unit
  //   const target = targets[targets.length - 1]
  // }
}

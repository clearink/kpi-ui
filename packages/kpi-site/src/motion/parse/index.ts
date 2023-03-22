// 解析运动量
// number => number
// color => color
// % => %
// 0 => auto

import { isNumber, isString } from '@kpi/shared'
import { clamp } from '../utils'

const createUnitType = (unit: string) => ({
  test: (v: string | number) => isString(v) && v.endsWith(unit) && v.split(' ').length === 1,
  parse: parseFloat,
  transform: (v: string | number) => `${v}${unit}`,
})

const degress = createUnitType('deg')
const percent = createUnitType('%')
const px = createUnitType('px')
const vw = createUnitType('vw')
const vh = createUnitType('vh')

const number = {
  test: isNumber,
  parse: parseFloat,
  transform: (v: number) => v,
}

const alpha = {
  ...number,
  transform: (v: number) => clamp(v, 0, 1),
}

const scale = {
  ...number,
  default: 1,
}

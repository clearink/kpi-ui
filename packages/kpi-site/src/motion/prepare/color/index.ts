import hex from './hex'
import hsl from './hsl'
import rgb from './rgb'
import clamp from '../../utils/clamp'

import type { RGBA } from '../interface'

export default {
  test: (v: any) => hex.test(v) || rgb.test(v) || hsl.test(v),
  prepare: (v: any) => {
    if (rgb.test(v)) return rgb.parse(v)
    if (hsl.test(v)) return hsl.parse(v)
    return hex.parse(v)
  },
  render: (v: RGBA) => {
    const r = clamp(v.red, 0, 255)
    const g = clamp(v.green, 0, 255)
    const b = clamp(v.blue, 0, 255)
    const a = clamp(v.alpha, 0, 1)
    return `rgba(${r},${g},${b},${a})`
  },
}

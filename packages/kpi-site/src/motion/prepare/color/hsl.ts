/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
import clamp from '../../utils/clamp'
import decompose from '../../utils/decompose'

import type { RGBA } from '../interface'

function hueToRgb(p: number, q: number, t: number) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export default {
  test: (v: string) => /^hsl/.test(v),
  parse: (v: string): RGBA => {
    let [h, s, l, a = 1] = decompose(v).numbers

    h /= 360
    s /= 100
    l /= 100
    a = clamp(a, 0, 1)

    let r = 0
    let g = 0
    let b = 0

    if (!s) r = g = b = l
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hueToRgb(p, q, h + 1 / 3)
      g = hueToRgb(p, q, h)
      b = hueToRgb(p, q, h - 1 / 3)
    }
    return {
      red: Math.round(r * 255),
      green: Math.round(g * 255),
      blue: Math.round(b * 255),
      alpha: a,
    }
  },
}

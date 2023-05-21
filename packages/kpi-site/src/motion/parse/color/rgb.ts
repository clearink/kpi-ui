import decompose from '../utils/decompose'

import type { RGBA } from '../interface'
import clamp from '../../utils/clamp'

const hsl = /^rgb/

export default {
  test: (v: string) => hsl.test(v),
  parse: (v: string): RGBA => {
    const [r, g, b, a = 1] = decompose(v).numbers

    return {
      red: Math.round(clamp(r, 0, 255)),
      green: Math.round(clamp(g, 0, 255)),
      blue: Math.round(clamp(b, 0, 255)),
      alpha: clamp(a, 0, 1),
    }
  },
}

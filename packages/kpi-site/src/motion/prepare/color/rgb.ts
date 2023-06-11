import decompose from '../../utils/decompose'
import clamp from '../../utils/clamp'

import type { RGBA } from '../interface'

export default {
  test: (v: string) => /^rgb/.test(v),
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

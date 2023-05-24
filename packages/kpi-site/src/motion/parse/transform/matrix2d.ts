import parseFunctionString from '../utils/parse_function_string'
import sanitize from '../utils/sanitize'

const matrix2d = /matrix\(([^)]+)\)/

const RAD2DEG = 180 / Math.PI

export default {
  test: (v: string) => matrix2d.test(v),
  parse: (v: string): any => {
    const parsed = parseFunctionString(v)

    if (!parsed) return {}

    // matrix(1, 0, 0, 1, 0, 0)
    const [a = 1, b = 0, c = 0, d = 1, e = 0, f = 0] = parsed.args.map(Number)

    const scaleX = Math.sqrt(a * a + b * b)
    let scaleY = Math.sqrt(c * c + d * d)

    const rotation = b || a ? Math.atan2(b, a) * RAD2DEG : 0

    const skewX = c || d ? Math.atan2(c, d) * RAD2DEG + rotation : 0

    skewX && (scaleY *= Math.abs(Math.cos(skewX / RAD2DEG)))

    return {
      translate3d: [e, f, 0].map((item) => `${item}px`).join(', '),
      rotate: [sanitize(rotation)].map((item) => `${item}deg`).join(', '),
      skew: [sanitize(skewX), 0].map((item) => `${item}deg`).join(', '),
      scale: [sanitize(scaleX), sanitize(scaleY)].join(', '),
    }
  },
}

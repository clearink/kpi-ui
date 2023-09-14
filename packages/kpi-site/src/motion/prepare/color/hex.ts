import type { RGBA } from '../interface'

const hex = /(^#[0-9A-F]{3}$)|(^#[0-9A-F]{4}$)|(^#[0-9A-F]{6}$)|(^#[0-9A-F]{8}$)/i

export default {
  test: (v: string) => hex.test(v),
  parse: (v: string): RGBA => {
    const isShorthand = v.length < 6

    const [r, g, b, a] = isShorthand
      ? Array.from({ length: 4 }, (_, i) => v.substring(i + 1, i + 2).repeat(2))
      : Array.from({ length: 4 }, (_, i) => v.substring(i * 2 + 1, i * 2 + 3))

    return {
      red: parseInt(r, 16),
      green: parseInt(g, 16),
      blue: parseInt(b, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1,
    }
  },
}

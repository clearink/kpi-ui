const deg = /deg$/
const grad = /grad$/
const rad = /rad$/
const turn = /turn$/

// 全都转成 deg
export default {
  test: (v: string) => deg.test(v) || grad.test(v) || rad.test(v) || turn.test(v),
  parse: (v: string) => {
    if (grad.test(v)) return parseFloat(v) * 0.9
    if (rad.test(v)) return (parseFloat(v) * 180) / Math.PI
    if (turn.test(v)) return parseFloat(v) * 360
    return parseFloat(v)
  },
  transform: (v: number) => `${v}deg`,
}

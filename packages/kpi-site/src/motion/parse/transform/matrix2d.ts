const matrix2d = /^matrix2d\(/

export default {
  test: (v: string) => matrix2d.test(v),
  parse: (v: string) => {},
}

const matrix3d = /^matrix3d\(/

export default {
  test: (v: string) => matrix3d.test(v),
  parse: (v: string) => {},
}

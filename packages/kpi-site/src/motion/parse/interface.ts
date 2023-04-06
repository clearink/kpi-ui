export interface UnitType<V = any> {
  test: (value: any) => boolean
  parse: (value: any) => any
  transform: (value) => any
}

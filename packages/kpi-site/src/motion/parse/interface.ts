export interface UnitType {
  test: (value: any) => boolean
  parse: (value: any) => any
  transform: (value: any) => any
}

export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

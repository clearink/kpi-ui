export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

export type Attr = ['attr', Record<string, string>]

export type Css = ['css', Record<string, string>]

export type Transform = ['transform', Record<string, string>]

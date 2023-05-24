export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

export interface ResolvedTransform {
  perspective: [string]
  skew: [string, string]
  translate: [string, string]
  scale: [number, string, string]
  rotate: [number, number, number, string]
}

export type Attr = ['attr', Record<string, string>]

export type Css = ['css', Record<string, string>]

export type Transform = ['transform', Record<string, string>]

export type TargetType = Element | null | undefined

export type GetTargetType = string | TargetType | (() => TargetType)

export type ResizeCallback = (el: Element) => void

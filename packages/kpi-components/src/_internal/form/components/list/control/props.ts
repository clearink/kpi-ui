export interface InternalListField {
  name: number
  key: number
  isListField: boolean
}
export interface FormListHelpers {
  append: (value?: any) => void
  prepend: (value?: any) => void
  remove: (index?: number | number[]) => void
  swap: (from: number, to: number) => void
  move: (from: number, to: number) => void
  replace: (index: number, value: any) => void
  insert: (index: number, value: any) => void
}

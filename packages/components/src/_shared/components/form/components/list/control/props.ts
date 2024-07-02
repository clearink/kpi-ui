export interface InternalListField {
  isListField: boolean
  key: number
  name: number
}
export interface FormListHelpers {
  append: (value?: any) => void
  insert: (index: number, value: any) => void
  move: (from: number, to: number) => void
  prepend: (value?: any) => void
  remove: (index?: number | number[]) => void
  replace: (index: number, value: any) => void
  swap: (from: number, to: number) => void
}

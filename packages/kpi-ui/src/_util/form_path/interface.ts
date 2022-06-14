export type PathKey = string
export type NodeType = 'object' | 'array'
export type NodePath =
  | PathKey
  | {
      type: NodeType
      attr: PathKey
    }
  | {
      type: NodeType
      attrs: { left: NodePath[]; right: NodePath[] }[]
    }

export interface TokenItem {
  type: 'Operator' | 'Bracket' | 'Attr'
  value: string
  used?: boolean
}
export type RemovedDestToken =
  | PathKey
  | {
      type: NodeType
      attr: PathKey
    }
  | {
      type: NodeType
      attrs: RemovedDestToken[]
    }

export type RemovedCommaToken =
  | PathKey
  | {
      type: NodeType
      attr: PathKey
    }
  | {
      type: NodeType
      attrs: RemovedCommaToken[][]
    }
export type BracketItem = { value: string; dest?: true }
export type GetValueResult = [boolean, any]

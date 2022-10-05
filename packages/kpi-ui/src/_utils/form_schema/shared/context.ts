// TODO: 重新设计一下 context

import { Message } from '../interface'

export default class SchemaContext {
  static create() {
    return new SchemaContext()
  }

  // path 将来可能会用到组件库时可能会用 name 替代
  issues: { path: (string | number)[]; message: string }[] = []

  addIssue(name: string | number, message: Message) {
    this.issues.push()
  }

  toString() {
    return JSON.stringify(this.issues, undefined, 2)
  }
}

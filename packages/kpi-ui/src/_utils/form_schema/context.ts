import { type SchemaIssue } from './interface'

export default class SchemaContext {
  static create() {
    return new SchemaContext()
  }

  issues: SchemaIssue[] = []

  get isEmpty() {
    return this.issues.length === 0
  }

  addIssue(issue: SchemaIssue) {
    this.issues.push(issue)
    return this
  }

  addIssues(issues: SchemaIssue[]) {
    this.issues = this.issues.concat(issues)
    return this
  }

  toString() {
    return `Validation Error: ${JSON.stringify(this.issues, null, 2)}`
  }
}

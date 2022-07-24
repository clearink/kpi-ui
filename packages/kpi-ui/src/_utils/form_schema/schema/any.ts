import BaseSchema from './base'

export default class AnySchema extends BaseSchema<any> {
  constructor() {
    super('object', (input): input is any => true)
  }

  static create() {
    return new AnySchema()
  }
}

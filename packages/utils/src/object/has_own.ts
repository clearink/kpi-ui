const _hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = Object.hasOwn
  ? Object.hasOwn.bind(null)
  : (o: object, v: PropertyKey) => _hasOwnProperty.call(o, v)

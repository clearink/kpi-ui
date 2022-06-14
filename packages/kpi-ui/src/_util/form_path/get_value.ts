import { NodePath, GetValueResult } from './interface'
import setValue from './set_value'
import { initValue, isPlainObject, isString } from './utils/_helps'

function getValue<D extends any>(object: D, paths: NodePath[]): GetValueResult {
  if (!paths.length || !isPlainObject(object)) {
    return [false, object]
  }
  const attribute = paths[0]
  if (isString(attribute)) {
    if (attribute in object) return [true, object[attribute]]
    return [false, undefined]
  }

  if ('attr' in attribute) {
    const { type, attr } = attribute
    return getValue(initValue(type, object[attr]), paths.slice(1))
  }
  if ('attrs' in attribute) {
    const { type, attrs } = attribute
    const init: GetValueResult = [true, initValue(type)]
    return attrs.reduce(([found, result], { left, right }) => {
      const [match, $value] = getValue(object, right)
      if (!match) return [false && found, result]
      return [true && found, setValue(result, left, $value)]
    }, init)
  }
  return [false, undefined]
}

export default getValue

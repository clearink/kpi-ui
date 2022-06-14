import { NodePath, GetValueResult } from './interface'
import setValue from './set_value'
import { initValue, isPlainObject, isString } from './utils/_helps'

function getValue<D extends any>(object: D, paths: NodePath[]): GetValueResult {
  if (!paths.length) return [false, object]

  const [attribute, ...$paths] = paths

  // 为了确保能够解析到最后一项
  if (!isPlainObject(object)) {
    const type = isString(attribute) ? 'object' : attribute.type
    return getValue(initValue(type), $paths)
  }

  if (isString(attribute)) {
    return [attribute in object, object[attribute]]
  }

  if ('attr' in attribute) {
    const { type, attr } = attribute
    return getValue(initValue(type, object[attr]), $paths)
  }
  if ('attrs' in attribute) {
    const { type, attrs } = attribute // 默认 attrs 也是最后一项
    const init: GetValueResult = [true, initValue(type)]
    return attrs.reduce(([found, result], { left, right }) => {
      const [match, $value] = getValue(object, right)
      if (!match) return [false && found, result] as GetValueResult
      return [true && found, setValue(result, left, $value)] as GetValueResult
    }, init)
  }
  return [false, object]
}

export default getValue

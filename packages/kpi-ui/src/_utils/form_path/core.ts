import { initValue } from './utils/_helps'
import { isArray, isObject } from '../validate_type'
import { NodePath, GetValueResult } from './interface'

function setValue<D>(object: D, paths: NodePath[], value: any) {
  if (!paths.length || !isObject(object)) return object

  const [attribute, ...$paths] = paths

  if (!isObject(attribute)) {
    if (isArray(object) && Number.isNaN(+attribute)) return object
    object[attribute] = value
  } else if ('attr' in attribute) {
    const { type, attr } = attribute
    object[attr] = setValue(initValue(type, object[attr]), $paths, value)
  } else if ('attrs' in attribute) {
    // 默认 attrs 也是最后一项
    return attribute.attrs.reduce((result, { left, right }) => {
      const [match, $value] = getValue(value, left)
      if (!match) return result // 匹配失败就不用继续 set 了
      return setValue(result, right, $value)
    }, object)
  }
  return object
}

function getValue<D>(object: D, paths: NodePath[]): GetValueResult {
  if (!paths.length) return [false, object]

  const [attribute, ...$paths] = paths

  // 为了确保能够解析到最后一项
  if (!isObject(object)) {
    const type = isObject(attribute) ? attribute.type : 'object'
    return getValue(initValue(type), $paths)
  }

  if (!isObject(attribute)) {
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

export { getValue, setValue }

import getValue from './get_value'
import { NodePath } from './interface'
import { initValue, isArray, isPlainObject, isString } from './utils/_helps'

function setValue<D extends any>(object: D, paths: NodePath[], value: any) {
  if (!paths.length || !isPlainObject(object)) return object

  const [attribute, ...$paths] = paths

  if (isString(attribute)) {
    if (isArray(object) && isNaN(+attribute)) return object
    object[attribute] = value
  } else if ('attr' in attribute) {
    const { type, attr } = attribute
    const $object = initValue(type, object[attr])
    object[attr] = setValue($object, $paths, value)
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

export default setValue

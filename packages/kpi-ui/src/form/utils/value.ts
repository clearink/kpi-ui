import {
  isNumber,
  isArray,
  isObject,
  isNullish,
  hasOwn,
  isObjectLike,
  rawType,
  isString,
} from '../../_utils'
import BaseControl from '../control/base_control'

import type { InternalNamePath } from '../internal_props'

function internalSet<V = any>(
  source: V,
  paths: InternalNamePath,
  value: any,
  removeUndefined = false
): V {
  if (paths.length === 0) return value

  const [path, ...rest] = paths

  let attr = {} as V
  if (isArray(source)) attr = [...source] as unknown as V
  else if (isObject(source)) attr = { ...source }
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V

  const $value = internalSet(attr[path], rest, value, removeUndefined)
  if ($value === undefined && removeUndefined) delete attr[path]
  else attr[path] = $value
  return attr
}

export function setIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSet(source, paths, value)
}

export function getIn<V = any>(values: V, paths: InternalNamePath): any {
  for (let i = 0; i < paths.length; i++) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}

export function deleteIn<V = any>(source: V, paths: InternalNamePath): any {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSet(source, paths, undefined, true)
}

export function existIn(source: any, paths: InternalNamePath) {
  for (let i = 0; i < paths.length; i++) {
    if (!isObjectLike(source)) return false
    if (!hasOwn(source, paths[i])) return false
    source = source[paths[i]]
  }
  return paths.length > 0
}

// 获取 source 的全部路径
export function getPaths(source: any, parent: InternalNamePath = []): InternalNamePath[] {
  // 不是对象或数组
  if (!isObject(source) && !isArray(source)) return []
  const isAnArray = isArray(source)
  // 空数组
  if (isAnArray && source.length === 0) return [parent]
  return Object.entries(source).reduce((res, [key, value]) => {
    const current = parent.concat(isAnArray ? Number(key) : key)
    if (!isObject(value) && !isArray(value)) return res.concat([current])
    return res.concat(getPaths(value, current))
  }, [] as InternalNamePath[])
}

// 合并对象并且 获取需要更新的字段路径
function internalMerge(
  target: any,
  source: any,
  updateMap: (data: any, namePath: InternalNamePath) => void,
  parent: InternalNamePath = []
) {
  const targetType = rawType(target)
  const sourceType = rawType(source)

  if (targetType !== sourceType) {
    updateMap(target, parent)
    updateMap(source, parent)

    return source
  }

  // 为基本类型
  if (!isObjectLike(target)) {
    if (target !== source) updateMap(target, parent)
    return source // 返回新值
  }

  // 数组和对象
  // TODO: 数组是直接覆盖还是需要合并呢？
  if (isObject(target) || isArray(target)) {
    const isAnArray = isArray(target)
    const newTarget = isAnArray ? [...target] : { ...target }
    return Object.entries(source).reduce((res, [key, value]) => {
      const current = parent.concat(isAnArray ? Number(key) : key)
      res[key] = internalMerge(res[key], value, updateMap, current)
      return res
    }, newTarget)
  }

  // 其他非基础类型数据
  return target
}

// 合并数据且要获得全部的数据路径
export function mergeAndGetPaths<V = any>(target: V, ...sources: any[]) {
  const updatePaths = new Map<string, InternalNamePath>()

  const setPath = (namePath: InternalNamePath) => {
    const key = BaseControl._getName(namePath)
    key && updatePaths.set(key, namePath)
  }

  const updateMap = (data: any, namePath: InternalNamePath) => {
    if (!isObjectLike(data)) setPath(namePath)
    else getPaths(data, namePath).forEach((path) => setPath(path))
  }
  const next = sources.reduce((res, item) => {
    return internalMerge(res, item, updateMap)
  }, target)
  console.log('next', next)
  return [[...updatePaths.values()], next] as [InternalNamePath[], V]
}

/**
 * import React, { useState } from 'react'
import { Form, kfc, Space } from '../../../src'
import useForm from '../../../src/form/hooks/use_form'
import '../../../src/pagination/style'
import './style.css'

function Input(props: any) {
  let value
  if ('value' in props) value = props.value || ''
  return (
    <input
      {...props}
      value={value}
    />
  )
}

export default function App() {
  const form = useForm()
  const [key, set] = useState(0)
  return (
    <div className="app-wrap">
      <button onClick={() => set(key + 1)}>set k</button>
      <Form
        form={form}
        key={key}
        name="basic"
        onFinish={console.log}
      >
        <Form.Field name={['username', 0]}>
          <Input />
        </Form.Field>

        <Form.Field name={['username', 1]}>
          <Input />
        </Form.Field>
        <Form.Field name={['username', 2]}>
          <Input />
        </Form.Field>

        <Form.Field shouldUpdate>
          <Input />
        </Form.Field>

        {/* <Form.Field>
          <InputNumber />
        </Form.Field> */}
        {/* 此二种 我觉得是不管什么都要更新的 */}
        <Form.Field shouldUpdate>
          {() => {
            return (
              <button
                type="button"
                onClick={() => {
                  console.log('onClick={() => {')
                  form.setFieldValue(['username'], [1,2])
                }}
              >
                submit
              </button>
            )
          }}
        </Form.Field>
      </Form>
    </div>
  )
}

 */
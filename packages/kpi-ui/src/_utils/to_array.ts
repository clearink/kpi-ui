import { Children, type ReactElement, type ReactNode } from 'react'
import { isFragment } from 'react-is'
import { isArray, isNullish } from './is'

/**
 * @desc 严格条件下，不是数组的都将返回空数组。
 * 非严格模式下 null，undefined 才返回空数组。
 */
export default function toArray<T>(candidate?: T | T[] | null, strict = false): T[] {
  if (isNullish(candidate)) return []
  if (isArray(candidate)) return candidate
  return strict ? [] : [candidate]
}

// 去除nullish，去除 fragment， 拍平 children
// React.Children.toArray 会改变原始的 key 值， 所以要自己写一个
export function toChildrenArray(children: ReactNode, keepEmpty = false) {
  let list: ReactElement[] = []
  // 舍弃 null undefined
  Children.forEach(children, (child: any) => {
    if (isNullish(child)) return
    // isArray 好像不用判断了？
    if (isArray(child)) {
      list = list.concat(toChildrenArray(child, keepEmpty))
    } else if (isFragment(child) && child.props) {
      list = list.concat(toChildrenArray(child.props.children, keepEmpty))
    } else list.push(child)
  })
  return list
}

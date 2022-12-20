import { Children, isValidElement, cloneElement } from 'react'
import type { ReactNode, Key, ReactElement } from 'react'

import { isFragment } from 'react-is'
import { isNullish } from './is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode, keys: Key[] = []) {
  return Children.toArray(children).reduce((result: ReactChild[], child, index) => {
    if (isNullish(child)) return result
    if (isFragment(child) && child.props) {
      const newKeys = keys.concat(child.key ?? index)
      const childList: ReactChild[] = flattenChildren(child.props.children, newKeys)
      return result.concat(childList)
    }
    if (isValidElement(child)) {
      const key = keys.concat(`${child.key}`).join('.')
      return result.concat(cloneElement(child, { key }))
    }
    return result.concat(child as Key)
  }, [])
}

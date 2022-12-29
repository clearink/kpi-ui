import { Children, isValidElement, cloneElement } from 'react'
import type { ReactNode, Key, ReactElement } from 'react'

import { isFragment } from 'react-is'
import { isArray, isNullish, isUndefined } from './is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode, key = '') {
  let result: ReactChild[] = []

  Children.forEach(children, (child, index) => {
    if (isNullish(child)) return

    if (isArray(child)) {
      result = result.concat(flattenChildren(child, `${key}.${index}`))
    } else if (isFragment(child) && child.props) {
      result = result.concat(flattenChildren(child.props.children, `${key}.${index}`))
    } else if (isValidElement(child)) {
      if (!isUndefined(child.key)) result.push(child)
      // eslint-disable-next-line react/no-array-index-key
      else result.push(cloneElement(child, { key: `${key}.${index}` }))
    } else result.push(child as Key)
  })

  return result
}

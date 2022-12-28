import { Children } from 'react'
import type { ReactNode, Key, ReactElement } from 'react'

import { isFragment } from 'react-is'
import { isArray, isNullish } from './is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode) {
  let result: ReactChild[] = []

  Children.forEach(children, (child) => {
    if (isNullish(child)) return

    if (isArray(child)) {
      result = result.concat(flattenChildren(child))
    } else if (isFragment(child) && child.props) {
      result = result.concat(flattenChildren(child.props.children))
    } else result.push(child as Key)
  })

  return result
}

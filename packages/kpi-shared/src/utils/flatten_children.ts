import { Children } from 'react'
import type { ReactNode, ReactElement } from 'react'

import { isFragment } from 'react-is'
import { isNullish } from './is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode) {
  return Children.toArray(children).reduce((result: ReactChild[], child) => {
    if (isNullish(child)) return result

    if (isFragment(child) && child.props) {
      return result.concat(flattenChildren(child.props.children))
    }

    result.push(child as ReactElement)
    return result
  }, [])
}

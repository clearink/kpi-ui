import { Children } from 'react'
import { isFragment } from 'react-is'
import type { ReactNode, ReactElement } from 'react'
import { isNullish } from './is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode) {
  return Children.toArray(children).reduce((result: ReactChild[], child) => {
    if (isNullish(child)) return result

    if (isFragment(child) && child.props) {
      const kids = flattenChildren(child.props.children)
      for (let i = 0; i < kids.length; i += 1) result.push(kids[i])
    } else result.push(child as ReactElement)

    return result
  }, [])
}

import { Children, type ReactElement, type ReactNode } from 'react'
import { isFragment } from 'react-is'
import { pushItem } from '../array'
import { isNullish } from '../is'

/**
 * @desc 去除 nullish, 去除 fragment， 拍平 children
 */
type ReactChild = ReactElement | string | number
export default function flattenChildren(children: ReactNode): ReactChild[] {
  return Children.toArray(children).reduce((result: ReactChild[], child) => {
    if (isNullish(child)) return result

    if (!isFragment(child) || !child.props) return pushItem(result, child as ReactElement)

    return pushItem(result, flattenChildren(child.props.children))
  }, [])
}

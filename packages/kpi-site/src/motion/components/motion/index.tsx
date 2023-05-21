import { createElement } from 'react'
import type { MotionProps } from './props'

export default function Motion(props: MotionProps) {
  const { tag = 'div', children } = props
  return createElement(tag, {}, children)
}

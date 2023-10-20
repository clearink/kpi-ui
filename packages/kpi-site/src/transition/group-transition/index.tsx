import { Children, ReactElement } from 'react'
import CSSTransition from '../css-transition'

export default function GroupTransition() {
  const children: ReactElement[] = []

  return Children.map(children, (child) => <CSSTransition>{child}</CSSTransition>)
}

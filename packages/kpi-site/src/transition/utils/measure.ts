// 自动检测过渡类型
import { TransitionProps } from '../props'

export default function getTransitionInfo(el: HTMLElement, type: TransitionProps['type']) {
  const styles = getComputedStyle(el)

  if (type === 'transition') {
    return {
      name: type,
      propCount: 2,
    }
  }

  if (type === 'animation') {
    return {
      name: type,
      propCount: 2,
    }
  }

  return {
    name: 'transition',
    propCount: 2,
  }

  // if (type === 'transition') {
  //   const property = styles.transitionProperty
  // } else if (type === 'animation') {
  //   //
  // } else {
  //   // measure
  // }
}

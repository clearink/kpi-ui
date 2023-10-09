import type { TransitionProps } from '..'

export default function formatClassNames(
  name: TransitionProps['name'],
  classNames: TransitionProps['classNames'] = {}
) {
  return {
    appear: {
      from: classNames.appear || `${name}-enter-from`,
      active: classNames.appearActive || `${name}-enter-active`,
      to: classNames.appearTo || `${name}-enter-to`,
    },
    enter: {
      from: classNames.enter || `${name}-enter-from`,
      active: classNames.enterActive || `${name}-enter-active`,
      to: classNames.enterTo || `${name}-enter-to`,
    },
    exit: {
      from: classNames.exit || `${name}-exit-from`,
      active: classNames.exitActive || `${name}-exit-active`,
      to: classNames.exitTo || `${name}-exit-to`,
    },
  }
}

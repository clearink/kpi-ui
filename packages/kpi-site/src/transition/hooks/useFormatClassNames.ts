import { useMemo } from 'react'

import type { TransitionProps } from '../props'

export default function useFormatClassNames(
  name: TransitionProps['name'],
  classNames: TransitionProps['classNames'] = {}
) {
  return useMemo(() => {
    const enter = {
      from: classNames.enter || `${name}-enter-from`,
      active: classNames.enterActive || `${name}-enter-active`,
      to: classNames.enterTo || `${name}-enter-to`,
    }

    const appear = {
      from: classNames.appear || enter.from,
      active: classNames.appearActive || enter.active,
      to: classNames.appearTo || enter.to,
    }

    const exit = {
      from: classNames.exit || `${name}-exit-from`,
      active: classNames.exitActive || `${name}-exit-active`,
      to: classNames.exitTo || `${name}-exit-to`,
    }

    return { appear, enter, exit }
  }, [
    classNames.appear,
    classNames.appearActive,
    classNames.appearTo,
    classNames.enter,
    classNames.enterActive,
    classNames.enterTo,
    classNames.exit,
    classNames.exitActive,
    classNames.exitTo,
    name,
  ])
}

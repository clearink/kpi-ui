import { useMemo } from 'react'
import fallback from '../utils/fallback'

import type { TransitionProps } from '../props'

export default function useFormatClassNames(
  name: TransitionProps['name'],
  classNames: TransitionProps['classNames'] = {}
) {
  return useMemo(() => {
    const enter = {
      from: fallback(classNames.enter, `${name}-enter-from`),
      active: fallback(classNames.enterActive, `${name}-enter-active`),
      to: fallback(classNames.enterTo, `${name}-enter-to`),
    }

    const appear = {
      from: fallback(classNames.appear, enter.from),
      active: fallback(classNames.appearActive, enter.active),
      to: fallback(classNames.appearTo, enter.to),
    }

    const exit = {
      from: fallback(classNames.exit, `${name}-exit-from`),
      active: fallback(classNames.exitActive, `${name}-exit-active`),
      to: fallback(classNames.exitTo, `${name}-exit-to`),
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

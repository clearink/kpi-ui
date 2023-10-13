import { useMemo } from 'react'
import fallback from '../utils/fallback'

import type { CSSTransitionProps } from '../props'

export default function useFormatClassNames(
  name: CSSTransitionProps['name'],
  classNames: CSSTransitionProps['classNames'] = {}
) {
  return useMemo(() => {
    const enter = {
      from: fallback(classNames.enter, name && `${name}-enter-from`),
      active: fallback(classNames.enterActive, name && `${name}-enter-active`),
      to: fallback(classNames.enterTo, name && `${name}-enter-to`),
    }

    const appear = {
      from: fallback(classNames.appear, enter.from),
      active: fallback(classNames.appearActive, enter.active),
      to: fallback(classNames.appearTo, enter.to),
    }

    const exit = {
      from: fallback(classNames.exit, name && `${name}-exit-from`),
      active: fallback(classNames.exitActive, name && `${name}-exit-active`),
      to: fallback(classNames.exitTo, name && `${name}-exit-to`),
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

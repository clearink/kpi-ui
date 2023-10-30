import { useMemo } from 'react'

import type { CSSTransitionProps } from '../props'

export default function useFormatClassNames(
  name: CSSTransitionProps['name'],
  classNames: CSSTransitionProps['classNames'] = {}
) {
  return useMemo(() => {
    const enter = {
      from: classNames.enter ?? (name && `${name}-enter-from`),
      active: classNames.enterActive ?? (name && `${name}-enter-active`),
      to: classNames.enterTo ?? (name && `${name}-enter-to`),
    }

    const appear = {
      from: classNames.appear ?? enter.from,
      active: classNames.appearActive ?? enter.active,
      to: classNames.appearTo ?? enter.to,
    }

    const exit = {
      from: classNames.exit ?? (name && `${name}-exit-from`),
      active: classNames.exitActive ?? (name && `${name}-exit-active`),
      to: classNames.exitTo ?? (name && `${name}-exit-to`),
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

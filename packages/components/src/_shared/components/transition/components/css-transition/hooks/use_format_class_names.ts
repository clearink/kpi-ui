import { useMemo } from 'react'

import type { CSSTransitionProps } from '../props'

import { APPEAR, ENTER, EXIT } from '../../../constants'

export default function useFormatClassNames(
  name: CSSTransitionProps['name'],
  classNames: CSSTransitionProps['classNames'] = {},
) {
  return useMemo(() => {
    const enter = {
      active: classNames.enterActive ?? (name && `${name}-enter-active`),
      from: classNames.enter ?? (name && `${name}-enter-from`),
      to: classNames.enterTo ?? (name && `${name}-enter-to`),
    }

    const appear = {
      active: classNames.appearActive ?? enter.active,
      from: classNames.appear ?? enter.from,
      to: classNames.appearTo ?? enter.to,
    }

    const exit = {
      active: classNames.exitActive ?? (name && `${name}-exit-active`),
      from: classNames.exit ?? (name && `${name}-exit-from`),
      to: classNames.exitTo ?? (name && `${name}-exit-to`),
    }

    return { [APPEAR]: appear, [ENTER]: enter, [EXIT]: exit }
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

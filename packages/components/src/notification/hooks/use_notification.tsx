// import type { VoidFn } from '@internal/types'

// import { useConstant, useForceUpdate } from '@comps/_shared/hooks'
// import { useMemo } from 'react'

// export class NotificationState {}

// export class NotificationAction {
//   constructor(public forceUpdate: VoidFn, private states: NotificationState) {}
// }

// export default function useNotification(config:) {
//   const update = useForceUpdate()

//   const states = useConstant(() => new NotificationState())

//   const actions = useMemo(() => new NotificationAction(update, states), [update, states])

//   const methods = 1
//   // holder如何创建?
//   const holder = <></>

//   return [methods, holder] as const
// }

export default function useNotification() {}

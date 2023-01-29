// import { useState } from 'react'
// import useIsomorphicEffect from '../use-isomorphic-effect'
// import { INIT_MATCHES, ScreenMatch } from '../../constant/breakpoint'
// import { isUndefined } from '../../utils'
// import useEvent from '../use-event'
// import MediaObserver from './media_observer'

// // 基础响应式断点 hooks
// export type ShouldUpdateHandler = (query: ScreenMatch<boolean>) => boolean
// export default function useBreakpoint(shouldUpdate?: ShouldUpdateHandler) {
//   const [matches, updateMatches] = useState(() => INIT_MATCHES)

//   const subscribe = useEvent((query: ScreenMatch<boolean>) => {
//     if (isUndefined(shouldUpdate) || shouldUpdate(query)) {
//       updateMatches(query)
//     }
//   })

//   useIsomorphicEffect(() => {
//     const observer = new MediaObserver(subscribe)
//     return () => observer.unsubscribe()
//   }, [subscribe])

//   return matches
// }

export default function useBreakpoint() {}

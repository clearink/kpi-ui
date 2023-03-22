// import { isFunction, isNumber } from '@kpi/shared'
// import { RefObject, useEffect, useState } from 'react'
// import resolveElements from '../utils/resolve_element'

// import type { ElementOrSelector } from '../utils/resolve_element'

// export interface InViewOptions {
//   root?: Element | Document
//   margin?: string
//   amount?: 'any' | 'all' | number
// }

// export type ViewChangeHandler = (entry: IntersectionObserverEntry) => void

// const threshold = (amount: InViewOptions['amount']) => {
//   if (isNumber(amount)) return amount
//   return amount === 'all' ? 1 : 0
// }
// function inView(
//   elementOrSelector: ElementOrSelector,
//   onStart: ViewChangeHandler,
//   options: InViewOptions = {}
// ) {
//   const { root, margin: rootMargin, amount = 'any' } = options
//   const elements = resolveElements(elementOrSelector)

//   const activeIntersections = new WeakMap<Element, ViewChangeHandler>()

//   const onIntersectionChange: IntersectionObserverCallback = (entries) => {
//     entries.forEach((entry) => {
//       const { target } = entry

//       const onEnd = activeIntersections.get(target)

//       if (entry.isIntersecting === Boolean(onEnd)) return

//       if (entry.isIntersecting) {
//         const newOnEnd = onStart(entry)

//         if (isFunction(newOnEnd)) activeIntersections.set(target, newOnEnd)
//         else observer.unobserve(target)
//       } else if (onEnd) {
//         onEnd(entry)
//         activeIntersections.delete(target)
//       }
//     })
//   }

//   const observer = new IntersectionObserver(onIntersectionChange, {
//     root,
//     rootMargin,
//     threshold: threshold(amount),
//   })

//   elements.forEach((element) => observer.observe(element))

//   return () => observer.disconnect()
// }

// export interface UseInViewOptions extends Omit<InViewOptions, 'root' | 'amount'> {
//   root?: RefObject<Element>
//   once?: boolean
//   amount?: 'some' | 'all' | number
// }
// export default function useInView(ref: RefObject<Element>, options: UseInViewOptions = {}) {
//   const { root, margin, amount, once = false } = options
//   const [isInView, setInView] = useState(false)

//   useEffect(() => {
//     if (!ref.current || (once && isInView)) return

//     const onEnter = () => {
//       setInView(true)
//       return once ? undefined : () => setInView(false)
//     }

//     return inView(ref.current, onEnter, {
//       root: root?.current || undefined,
//       margin,
//       amount: amount === 'some' ? 'any' : amount,
//     })
//   }, [root, ref, margin, once])

//   return isInView
// }

// TODO: 待完成
// 检测 DOM 是否移动到 view port
export default function useInView() {}

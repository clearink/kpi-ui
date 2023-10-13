import { Children, ReactElement, useRef, Key, cloneElement, isValidElement } from 'react'
import { useConstant, useIsomorphicEffect, useMounted } from '@kpi/shared'
import batch from '../CSSTransition/utils/batch'
import useTransitionStore from './hooks/useTransitionStore'
import isSameElement from './utils/same'

import type { SwitchTransitionProps } from './props'
import type { CSSTransitionProps } from '../CSSTransition/props'

const getKey = (child: ReactElement<any>): Key => child.key || ''
// 实现退场动画
// TODO 是否要实现多个组件的退场动画呢？
export default function SwitchTransition(props: SwitchTransitionProps) {
  const { children } = props

  const mounted = useMounted()

  const present = useRef<ReactElement<CSSTransitionProps>>()

  const map = useRef(new Map<Key, ReactElement<any>>()).current

  // 只获取合法的 react element
  const allElements: ReactElement[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    allElements.push(child)
    map.set(getKey(child), child)
  })

  // 当前展示的子元素

  // if (!present.current) present.current = allElements[0]

  const shouldTransition = false // !isSameElement(present.current, children)
  if (shouldTransition) {
    console.log('should transition')
  }

  if (!isValidElement(present.current)) return null

  return cloneElement(present.current, { when: true })
  // 1. 找出需要执行 exiting 的数据
  // 2. 找出需要执行 entered 的数据
  // 3. 根据 mode 执行不同的逻辑

  // allChildren.set()

  // const store = useTransitionStore(children)

  // // if (a !== children) setA(children)

  // // 只有 children 切换时才会执行动画

  // // 当子组件不一致时，需要
  // const shouldTransition = !isSameElement(store.current, children)

  // if (shouldTransition && !store.running) store.nodeList.push(children)

  // console.log(store.nodeList)
  // // if (shouldTransition) {
  // //   const el = store.instance
  // //   if (!el) return el

  // //   if (mode === 'out-in' && isValidElement(children)) {
  // //     if (!store.running) {
  // //       store.running = true
  // //       const newInstance = cloneElement(el, {
  // //         when: false,
  // //         onExited: batch(el.props.onExited, () => {
  // //           console.log('exited')
  // //           store.running = false
  // //           // 显示设置 appear = true
  // //           store.setInstance(cloneElement(children, { when: true, appear: true }))
  // //           store.forceUpdate()
  // //         }),
  // //       })

  // //       store.setInstance(newInstance)
  // //     }
  // //   }
  // // }
}

/**
 * static getDerivedStateFromProps(props, state) {
    if (props.children == null) {
      return {
        current: null,
      };
    }

    if (state.status === ENTERING && props.mode === modes.in) {
      return {
        status: ENTERING,
      };
    }

    if (state.current && areChildrenDifferent(state.current, props.children)) {
      return {
        status: EXITING,
      };
    }

    return {
      current: React.cloneElement(props.children, {
        in: true,
      }),
    };
  }


  const {
      props: { children, mode },
      state: { status, current },
    } = this;

    const data = { children, current, changeState: this.changeState, status };
    let component;
    switch (status) {
      case ENTERING:
        component = enterRenders[mode](data);
        break;
      case EXITING:
        component = leaveRenders[mode](data);
        break;
      case ENTERED:
        component = current;
    }
 */

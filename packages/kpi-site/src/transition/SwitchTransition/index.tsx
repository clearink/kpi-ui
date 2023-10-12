import { useEvent, useIsomorphicEffect } from '@kpi/shared'
import { cloneElement, isValidElement } from 'react'
import useTransitionStore from './hooks/useTransitionStore'
import isSameElement from './utils/same'

import type { SwitchTransitionProps } from './props'
import batch from '../CSSTransition/utils/batch'

export default function SwitchTransition(props: SwitchTransitionProps) {
  // 实现退场动画
  const { children, mode } = props

  const store = useTransitionStore(children)

  // 只有 children 切换时才会执行动画

  const shouldTransition = !isSameElement(store.instance, children)

  if (shouldTransition) {
    const el = store.instance
    if (!el) return el

    if (mode === 'out-in' && isValidElement(children)) {
      if (store.status === 'EXITING') {
        console.log('1232')
        // 立即取消
        store.status = 'ENTERED'

        const newInstance = cloneElement(children, { when: true })

        store.setInstance(newInstance)
      } else {
        store.status = 'EXITING'

        const newInstance = cloneElement(el, {
          when: false,
          onExited: batch(el.props.onExited, () => {
            store.setInstance(cloneElement(children, { when: true, appear: true }))
            store.forceUpdate()
          }),
        })

        store.setInstance(newInstance)
      }
    }
  }

  return store.instance
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

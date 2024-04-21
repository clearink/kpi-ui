import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { omit } from '@kpi-ui/utils'
import { cloneElement, createElement, useMemo, type ReactElement } from 'react'
import { batch } from '../../../_shared/utils'
import runCounter from '../../../utils/run_counter'
import makeUniqueId from '../../../utils/unique_id'
// comps
import CSSTransition from '../../css-transition'
// types
import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

const uniqueId = makeUniqueId('st-')

class TransitionState<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: Switch<E>) {
    this.props = props

    this.current = props.children

    this.elements = [{ fresh: true, el: this.makeElement(this.current, { when: true }) }]
  }

  props: Switch<E>

  current: ReactElement

  elements: { el: ReactElement; fresh: boolean }[] = []

  /**@internal */
  makeElement = (element: ReactElement, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['mode', 'children']) as CSS

    Object.assign(preset, extra, { key: uniqueId() })

    return createElement(CSSTransition, preset, element)
  }
}

class TransitionAction<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, private states: TransitionState<E>) {}

  injectLatestProps = (value: Switch<E>) => {
    this.states.props = value
  }

  runOutInSwitch = () => {
    this.states.elements = [
      {
        fresh: false,
        el: cloneElement(this.states.elements[0].el, {
          when: false,
          appear: true,
          onExited: batch(this.states.props.onExited, () => {
            this.states.current = this.states.props.children

            this.states.elements = [
              {
                fresh: true,
                el: this.states.makeElement(this.states.current, { when: true, appear: true }),
              },
            ]

            this.forceUpdate()
          }),
        }),
      },
    ]
  }

  runInOutSwitch = () => {
    this.states.current = this.states.props.children

    this.states.elements = [
      {
        fresh: false,
        el: cloneElement((this.states.elements[1] || this.states.elements[0]).el, {
          onEntered: this.states.props.onEntered,
          onExited: this.states.props.onExited,
        }),
      },
      {
        fresh: true,
        el: this.states.makeElement(this.states.current, {
          when: true,
          appear: true,
          onEntered: batch(this.states.props.onEntered, () => {
            this.states.elements = [
              {
                fresh: false,
                el: cloneElement(this.states.elements[0].el, {
                  when: false,
                  onExited: batch(this.states.props.onExited, () => {
                    this.states.elements = [this.states.elements[1]]
                    this.forceUpdate()
                  }),
                }),
              },
              this.states.elements[1],
            ]
            this.forceUpdate()
          }),
        }),
      },
    ]
  }

  runDefaultSwitch = () => {
    this.states.current = this.states.props.children

    const resolve = runCounter(2, () => {
      this.states.elements = [this.states.elements[1]]
      this.forceUpdate()
    })

    this.states.elements = [
      {
        fresh: false,
        el: cloneElement((this.states.elements[1] || this.states.elements[0]).el, {
          when: false,
          appear: true,
          onEntered: this.states.props.onEntered,
          onExited: batch(this.states.props.onExited, resolve),
        }),
      },
      {
        fresh: true,
        el: this.states.makeElement(this.states.current, {
          when: true,
          appear: true,
          onEntered: batch(this.states.props.onEntered, resolve),
        }),
      },
    ]
  }

  renderNodes = () => {
    const { children } = this.states.props

    const elements: ReactElement[] = []

    this.states.elements.forEach((item) => {
      if (!item.fresh) return elements.push(item.el)

      const isChildrenEqual = item.el.props.children === children

      item.el = isChildrenEqual ? item.el : cloneElement(item.el, undefined, children)

      elements.push(item.el)
    })

    return elements
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Switch<E>) {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TransitionState(forceUpdate, props))

  const actions = useMemo(() => new TransitionAction(forceUpdate, states), [forceUpdate, states])

  // 不能直接在渲染期间 write ref
  // prettier-ignore
  useMemo(() => { actions.injectLatestProps(props) }, [actions, props])

  return { states, actions }
}

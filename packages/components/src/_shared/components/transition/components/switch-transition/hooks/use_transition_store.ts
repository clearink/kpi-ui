import { batch, omit } from '@kpi-ui/utils'
import { useConstant, useForceUpdate } from '_shared/hooks'
import { makeUniqueId } from '_shared/utils'
import { type ReactElement, cloneElement, createElement, useMemo } from 'react'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

import runCounter from '../../../utils/run_counter'
import CSSTransition from '../../css-transition'

const uniqueId = makeUniqueId('st-')

class TransitionState<E extends HTMLElement> {
  current: ReactElement

  elements: { el: ReactElement; fresh: boolean }[] = []

  /** @internal */
  makeElement = (element: ReactElement, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['mode', 'children']) as CSS

    Object.assign(preset, extra, { key: uniqueId() })

    return createElement(CSSTransition, preset, element)
  }

  props: Switch<E>

  constructor(
    public forceUpdate: () => void,
    props: Switch<E>,
  ) {
    this.props = props

    this.current = props.children

    this.elements = [{ el: this.makeElement(this.current, { when: true }), fresh: true }]
  }
}

class TransitionAction<E extends HTMLElement> {
  injectLatestProps = (value: Switch<E>) => {
    this.states.props = value
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

  runDefaultSwitch = () => {
    this.states.current = this.states.props.children

    const resolve = runCounter(2, () => {
      this.states.elements = [this.states.elements[1]]
      this.forceUpdate()
    })

    this.states.elements = [
      {
        el: cloneElement((this.states.elements[1] || this.states.elements[0]).el, {
          appear: true,
          onEntered: this.states.props.onEntered,
          onExited: batch(this.states.props.onExited, resolve),
          when: false,
        }),
        fresh: false,
      },
      {
        el: this.states.makeElement(this.states.current, {
          appear: true,
          onEntered: batch(this.states.props.onEntered, resolve),
          when: true,
        }),
        fresh: true,
      },
    ]
  }

  runInOutSwitch = () => {
    this.states.current = this.states.props.children

    this.states.elements = [
      {
        el: cloneElement((this.states.elements[1] || this.states.elements[0]).el, {
          onEntered: this.states.props.onEntered,
          onExited: this.states.props.onExited,
        }),
        fresh: false,
      },
      {
        el: this.states.makeElement(this.states.current, {
          appear: true,
          onEntered: batch(this.states.props.onEntered, () => {
            this.states.elements = [
              {
                el: cloneElement(this.states.elements[0].el, {
                  onExited: batch(this.states.props.onExited, () => {
                    this.states.elements = [this.states.elements[1]]
                    this.forceUpdate()
                  }),
                  when: false,
                }),
                fresh: false,
              },
              this.states.elements[1],
            ]
            this.forceUpdate()
          }),
          when: true,
        }),
        fresh: true,
      },
    ]
  }

  runOutInSwitch = () => {
    this.states.elements = [
      {
        el: cloneElement(this.states.elements[0].el, {
          appear: true,
          onExited: batch(this.states.props.onExited, () => {
            this.states.current = this.states.props.children

            this.states.elements = [
              {
                el: this.states.makeElement(this.states.current, { appear: true, when: true }),
                fresh: true,
              },
            ]

            this.forceUpdate()
          }),
          when: false,
        }),
        fresh: false,
      },
    ]
  }

  constructor(
    public forceUpdate: () => void,
    private states: TransitionState<E>,
  ) {}
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Switch<E>) {
  const update = useForceUpdate()

  const states = useConstant(() => new TransitionState(update, props))

  const actions = useMemo(() => new TransitionAction(update, states), [update, states])

  // prettier-ignore
  useMemo(() => { actions.injectLatestProps(props) }, [actions, props])

  return { actions, states }
}

/* eslint-disable no-param-reassign */

import { isFunction } from '@kpi/shared'

import type { MotionAnimation } from './animation'

const accessor = <V extends object>(list: V[]) => {
  return {
    get<K extends keyof V>(prop: K) {
      return list.map((item) => item[prop])
    },
    set<K extends keyof V>(prop: K, value: V[K]) {
      list.forEach((item) => {
        item[prop] = value
      })
    },
  }
}

const run = (funcs: VoidFunction[]) => funcs.forEach((func) => isFunction(func) && func())

const max = (list: number[]) => Math.max.apply(null, list)

const sum = (list: number[]) => list.reduce((acc, cur) => acc + cur, 0)

export default function playbackControl(animations: MotionAnimation[]): MotionAnimation {
  const { get, set } = accessor(animations)

  return {
    get time() {
      return max(get('time'))
    },
    set time(t: number) {
      set('time', t)
    },
    get speed() {
      return get('speed')[0]
    },
    set speed(speed: number) {
      set('speed', speed)
    },
    get duration() {
      return max(get('duration'))
    },
    play: () => {
      run(get('play'))
    },

    pause: () => {
      run(get('pause'))
    },

    stop: () => {
      run(get('stop'))
    },

    complete: () => {
      run(get('complete'))
    },

    cancel: () => {
      run(get('cancel'))
    },

    // thenable
    then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
      return Promise.all(animations).then(onfulfilled, onrejected)
    },
  }
}

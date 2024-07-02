import { isFunction, isUndefined, shallowUnequal } from '@kpi-ui/utils'
import { type Dispatch, type SetStateAction, useState } from 'react'

import { useEvent } from '../use-event'

export function useControllableProp<T>(prop: T | undefined, state: T) {
  const controlled = !isUndefined(prop)

  return [controlled ? prop : state, controlled] as const
}

export interface ControllableStateProps<T> {
  defaultValue?: (() => T) | T
  onChange?: (value: T) => any
  shouldUpdate?: (prev: T, next: T) => boolean
  value?: T
}

export function useControllableState<T>(props: ControllableStateProps<T>) {
  const { defaultValue, onChange, shouldUpdate = shallowUnequal, value } = props

  const [internal, setInternal] = useState(defaultValue as T)

  const [external, controlled] = useControllableProp(value, internal)

  const setState = useEvent((state: SetStateAction<T>) => {
    const next = isFunction(state) ? state(external) : state

    if (!shouldUpdate(external, next)) return

    if (!controlled) setInternal(next)

    onChange && onChange(next)
  })

  return [external, setState] as [T, Dispatch<SetStateAction<T>>]
}

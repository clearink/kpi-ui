// utils
import { mergeRefs } from '@kpi-ui/utils'
import useEvent from '../use-event'
// types
import { type Ref } from 'react'

export default function useComposeRefs<T extends Ref<any>>(...refs: T[]) {
  return useEvent((el: T | null) => mergeRefs(...refs)(el))
}

import type { ReactElement } from 'react'

export default function getKey(el: ReactElement<any>) {
  return el.key || ''
}

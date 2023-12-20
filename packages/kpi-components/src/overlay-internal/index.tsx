import { createPortal } from 'react-dom'

import type { OverlayProps } from './props'
// 提供给 drawer. modal 使用
export default function Overlay(props: OverlayProps) {
  return <></>
}

function Modal() {
  return (
    <Overlay name="fade-enter" getContainer={props.getContainer} open={xxx}>
      <div>header</div>
      <div>content</div>
      <div>footer</div>
    </Overlay>
  )
}

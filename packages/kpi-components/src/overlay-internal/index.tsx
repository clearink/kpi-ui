import { createPortal } from 'react-dom'

import type { OverlayProps } from './props'
// 提供给 drawer. modal 使用
export default function Overlay(props: OverlayProps) {
  const [] = usePortal(props)
  return <></>
}

function usePortal(props: OverlayProps) {
  const { getContainer, motion, open, ...rest } = props

  // 返回一个函数 此处仅封装 getContainer 方法即可
  return []
}

function Modal() {
  return (
    <Overlay motion="fade-enter" getContainer={props.getContainer} open={xxx}>
      <div>header</div>
      <div>content</div>
      <div>footer</div>
    </Overlay>
  )
}

// batchAppendChild ?

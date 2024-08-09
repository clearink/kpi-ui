import type { StatusType } from '@comps/_shared/types'

import { presetStatus } from '@comps/_shared/constants/status'
import { nextTick, noop, ownerBody } from '@internal/utils'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

import type { NotificationMethods, NotificationProps } from '../props'

function W() {
  useEffect(() => {
    console.log('mounted')
  }, [])
  return createPortal(<div>12312123</div>, ownerBody())
}

export default function makeStaticMethods() {
  // 闭包保存数据
  let cleanup = noop
  // 1. 创建的render,container...
  // 此处只负责创建一个新的 ReactDOMRoot
  const impl = (_type: StatusType) => (_props: NotificationProps) => {
    cleanup()

    const fragment = document.createDocumentFragment()

    const root = createRoot(fragment)

    root.render(<W />)

    cleanup = nextTick(() => {

    })
  }

  const staticMethods = presetStatus.reduce((result, type) => {
    result[type] = impl(type)

    return result
  }, {} as NotificationMethods)

  return staticMethods

  // 怎样才能返回那几个方法呢?
}

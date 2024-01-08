import { isFunction, isNullish, isString } from '@kpi-ui/utils'
import { createPortal } from 'react-dom'

import type { ContainerType, OverlayProps } from './props'
import { useEffect, useMemo, useState } from 'react'
import { useDerivedState, useEvent, useForceUpdate } from '@kpi-ui/hooks'

// 提供给 drawer. modal 使用
export default function Overlay(props: OverlayProps) {
  const { children: _children } = props

  const container = useOverlayContainer(props)

  const children = isNullish(container) ? _children : createPortal(_children, container)
  console.log('children', children)
  return <div className="kpi-overlay">{children}</div>
}

function useOverlayContainer(props: OverlayProps) {
  const forceUpdate = useForceUpdate()

  // 获取最新的 container 数据
  const getContainer = useEvent(() => {
    const { container } = props
    if (isNullish(container)) return null

    if (isString(container)) return document.querySelector<HTMLElement>(container)

    if (isFunction(container)) return container()

    return container
  })

  const [container, setContainer] = useState<ContainerType>(null)

  // 不能直接去计算,因为第一次ref获取的元素为null,需要延迟计算
  // useEffect(() => {
  //   if(open)
  // }, [])

  return getContainer()
}

/**
 * antd 此处有bug, 当open=false 时会渲染在 body下面, open=true时会渲染在 .fake-container 元素下
 *   <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        forceRender
        onCancel={handleCancel}
        getContainer={ref.current!}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <div className="fake-container" ref={ref}></div>
 */

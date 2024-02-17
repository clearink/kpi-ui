// utils
import { useComposeRefs, useControllableState, useDebounceCallback } from '@kpi-ui/hooks'
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useRef } from 'react'
import { usePrefixCls } from '../../_shared/hooks'
import useDomRect from './hooks/use_dom_rect'
// comps
import Overlay from '../overlay'
// types
import type { PopoverProps } from './props'

const defaultProps: Partial<PopoverProps> = {}

function InternalTooltip(_props: PopoverProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, content } = props

  const rootPrefixCls = usePrefixCls()
  const prefixCls = `${rootPrefixCls}-tooltip`
  /**
   * 1. 定位
   * 2. 位置
   * 3. 移动
   */

  // const ref = useRef<HTMLDivElement>(null)
  const ref = useRef<Element>(null)

  // 获取 reference 的位置，大小
  const [refRect, setRefRect] = useDomRect(ref)

  const composedRef = useComposeRefs(ref, (children as any).ref)

  const [open, setOpen] = useControllableState({
    value: props.open,
    defaultValue: false,
    onChange: props.onOpenChange,
  })

  // const setDebouncedOpen = useDebounceCallback(50, setOpen)

  const onMouseEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    console.log('enter', e)
    setRefRect({
      width: (200 * Math.random()) | 0,
      height: (400 * Math.random()) | 0,
      left: (400 * Math.random()) | 0,
      top: (400 * Math.random()) | 0,
    })
    setOpen(true)
  }
  const onMouseLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    console.log('leave', e)
    setOpen(false)
  }

  return (
    <>
      {cloneElement(children, {
        ref: composedRef,
        onMouseEnter,
        onMouseLeave,
      })}
      <Overlay
        open={open}
        zIndex={props.zIndex}
        mask={false}
        transitions={{
          content: `${rootPrefixCls}-slide-bottom`,
        }}
        onEnter={(el) => {
          // 获取 文本的大小，高度
          const rect = el.getBoundingClientRect()
          // console.log(rect, ref.current?.getBoundingClientRect())
          // 将 el的位置附加到 reference 上
          console.log('content', rect)
          console.log('reference', refRect)
        }}
      >
        <div className={prefixCls} style={{ position: 'absolute', ...refRect }}>
          <div className={`${prefixCls}__arrow`}></div>
          <div className={`${prefixCls}__main`}>
            <div className={`${prefixCls}__title`}></div>
            <div className={`${prefixCls}__content`}>{content}</div>
          </div>
        </div>
      </Overlay>
    </>
  )
}

/**
 * @zh 内部组件
 */
export default withDisplayName(InternalTooltip)

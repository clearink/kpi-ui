// utils
import { useControllableState } from '@kpi-ui/hooks'
import { cls, mergeRefs, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement } from 'react'
import { useSemanticStyles } from '../../_shared/hooks'
import useTooltipAlign from './hooks/use_tooltip_align'
import useTooltipStore from './hooks/use_tooltip_store'
// comps
import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
// types
import type { InternalTooltipProps } from './props'

const defaultProps: Partial<InternalTooltipProps> = {
  trigger: 'hover',
}

function InternalTooltip(_props: InternalTooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, content, zIndex, transitions, fresh, className, classNames = {} } = props

  const store = useTooltipStore()

  const styles = useSemanticStyles(props.style, props.styles)

  const [refRect, setRefRect] = useTooltipAlign(store, props)
  /**
   * 1. 定位
   * 2. 位置
   * 3. 移动
   */

  // 获取 reference 的位置，大小

  const [open, setOpen] = useControllableState({
    value: props.open,
    defaultValue: false,
    onChange: props.onOpenChange,
  })

  const onAlign = () => {
    // align trigger and tooltip
  }

  const onMouseEnter: React.MouseEventHandler<HTMLElement> = () => {
    setOpen(true)
  }
  const onMouseLeave: React.MouseEventHandler<HTMLElement> = () => {
    console.log('leave')
    setOpen(false)
  }

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(store.trigger, (children as any).ref),
        onMouseEnter,
        onMouseLeave,
      })}
      <Overlay
        mask={false}
        open={open}
        zIndex={zIndex}
        transitions={transitions}
        onEnter={(el, appearing) => {
          // 获取 文本的大小，高度
          // const rect = el.getBoundingClientRect()
          // console.log(rect, ref.current?.getBoundingClientRect())
          // 将 el的位置附加到 reference 上
          console.log('onenter', el, appearing)
          // console.log('trigger', store.tooltip)
          // console.log('tooltip', el)
          // 获取 trigger 的位置
          // 计算 el 应该出现的位置
        }}
      >
        <div
          ref={store.tooltip}
          className={cls(className, classNames.root)}
          style={{
            ...styles.root,
          }}
        >
          <div className={classNames.arrow} style={styles.arrow}></div>
          {/* 内容缓存 */}
          <ShouldUpdate when={open || !!fresh}>
            <div className={classNames.main} style={styles.main}>
              <div className={classNames.title} style={styles.title}></div>
              <div className={classNames.content} style={styles.content}>
                {content}
              </div>
            </div>
          </ShouldUpdate>
        </div>
      </Overlay>
    </>
  )
}

/**
 * @zh 内部组件
 */
export default withDisplayName(InternalTooltip)

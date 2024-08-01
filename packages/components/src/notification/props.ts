import type { HasClosable, NoticePlacement, NoticeType, SemanticStyledProps } from '@comps/_shared/types'
import type { GetTargetElement } from '@comps/_shared/utils'
import type { DOMAttributes, MouseEventHandler, ReactNode } from 'react'

// 调用 notification 函数时的参数
export interface NotificationProps extends HasClosable, SemanticStyledProps<'closeBtn' | 'root' | 'wrap'> {
  /**
   * @description 底部内容
   */
  footer?: ReactNode

  /**
   * @description 通知提醒内容
   * @required
   */
  description: ReactNode

  /**
   * @description 默认4.5秒后自动关闭, 配置为 null 则不会关闭
   * @default 4.5
   */
  duration?: number

  /**
   * @description 自定义图标
   */
  icon?: ReactNode

  /**
   * @description 当前通知唯一标识
   */
  key?: React.Key

  /**
   * @description 通知提醒标题
   * @required
   */
  message: ReactNode

  /**
   * @description 弹出位置
   * @enum 'top'|'topLeft'|'topRight'...
   */
  placement?: NoticePlacement

  /**
   * @description 点击通知时触发的函数
   */
  onClick?: MouseEventHandler<HTMLDivElement>

  /**
   * @description 通知关闭时触发
   */
  onClose?: () => void

  /**
   * @description 传递给通知 div 元素上的对象
   */
  attrs?: DOMAttributes<HTMLDivElement>
}

// notification.config 函数时的参数
export interface NotificationConfig extends NotificationProps {
  /**
   * @description 消息从底部弹出时的起始距离
   */
  fromBottomOpenSpace?: number

  /**
   * @description 消息从顶部弹出时的起始距离
   */
  fromTopOpenSpace?: number

  getContainer?: GetTargetElement<Document | Element | HTMLElement>

  stack?: { threshold: number } | boolean

  maxCount?: number
}

export type StaticNoticeUtils = Record<NoticeType, (config: NotificationConfig) => void>

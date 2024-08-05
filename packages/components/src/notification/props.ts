import type { HasClosable, NotificationPlacement, SemanticStyledProps, StatusType } from '@comps/_shared/types'
import type { GetTargetElement } from '@comps/_shared/utils'
import type { DOMAttributes, MouseEventHandler, ReactNode } from 'react'

// 调用 notification 函数时的参数
export interface NotificationProps extends HasClosable, SemanticStyledProps<'closeBtn' | 'root' | 'wrap'> {
  /**
   * @zh 底部内容
   */
  footer?: ReactNode

  /**
   * @zh 通知提醒内容
   * @required
   */
  description: ReactNode

  /**
   * @zh 默认4.5秒后自动关闭, 配置为 null 则不会关闭
   * @default 4.5
   */
  duration?: number

  /**
   * @zh 自定义图标
   */
  icon?: ReactNode

  /**
   * @zh 当前通知唯一标识
   */
  key?: React.Key

  /**
   * @zh 通知提醒标题
   * @required
   */
  message: ReactNode

  /**
   * @zh 弹出位置
   * @enum
   * @default topRight
   */
  placement?: NotificationPlacement

  /**
   * @zh 点击通知时触发的函数
   */
  onClick?: MouseEventHandler<HTMLDivElement>

  /**
   * @zh 通知关闭时触发
   */
  onClose?: () => void

  /**
   * @zh 传递给通知 div 元素上的对象
   */
  attrs?: DOMAttributes<HTMLDivElement>

  /**
   * @zh 是否展示进度条
   * @default false
   */
  showProgress?: boolean

  /**
   * @zh 悬停时暂停计时
   * @default true
   */
  pauseOnHover?: boolean

  /**
   * @zh 主题状态
   * @enum
   */
  type?: StatusType

  /**
   * @zh 供屏幕阅读器识别的通知内容语义，默认为 alert。此情况下屏幕阅读器会立即打断当前正在阅读的其他内容，转而阅读通知内容
   * @enum
   * @default alert
   */
  role?: 'alert' | 'status'
}

// notification.config/ useNotification 函数时的参数
export interface NotificationConfig extends HasClosable,
  Pick<NotificationProps, 'duration' | 'pauseOnHover' | 'placement' | 'showProgress'> {
  /**
   * @zh 消息从顶部弹出时的起始距离
   * @default 24
   */
  top?: number

  /**
   * @zh 消息从底部弹出时的起始距离
   * @default 24
   */
  bottom?: number

  /**
   * @zh 渲染节点的父级位置
   * @default () => document.body
   */
  getContainer?: GetTargetElement<HTMLElement | ShadowRoot>

  /**
   * @zh 堆叠模式，超过阈值时会将所有消息收起
   * @default '{ threshold:3 }'
   */
  stack?: { threshold: number } | boolean

  /**
   * @zh 最大显示数, 超过限制时,最早的消息会被自动关闭
   */
  maxCount?: number

}

export type NotificationMethods = Record<StatusType, (props: NotificationProps) => void>

/**
 * |-----------------------------------|
 * |-----------------------------------|
 * |           default props           |
 * |-----------------------------------|
 * |-----------------------------------|
 */

export const defaultNotificationProps: Partial<NotificationProps> = {
  duration: 4.5,
  placement: 'topRight',
  showProgress: false,
  pauseOnHover: true,
}

export type ReactRef<T = any> = React.MutableRefObject<T> | React.Ref<T>

// components
export interface StyledProps {
  className?: string
  style?: React.CSSProperties
}
export interface SemanticStyledProps<K extends string> extends StyledProps {
  classNames?: Partial<Record<K, string>>
  styles?: Partial<Record<K, React.CSSProperties>>
}

export interface HasChildren<S = React.ReactNode> {
  children?: S
}

export type PopupPlacement =
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftBottom' | 'leftTop'
  | 'right' | 'rightBottom' | 'rightTop'
  | 'top' | 'topLeft' | 'topRight'

export type NotificationPlacement =
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'top' | 'topLeft' | 'topRight'

/**
 * @description 可关闭功能统一策略
 */
export interface HasClosable {
  closeIcon?: React.ReactNode
  closable?: ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | boolean
}

export interface HasIconRenderClosable extends HasClosable {
  closeIconRender?: (icon: React.ReactNode) => React.ReactNode
}

// 状态类型
export type StatusType = 'error' | 'info' | 'success' | 'warning'

// 提醒类型
export type NotificationType = StatusType

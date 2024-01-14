export type ContainerType = HTMLElement | false | null
// false 时, 视为使用 document.body
export type GetContainerType = string | ContainerType | (() => ContainerType)

export interface PortalProps {
  children?: React.ReactNode

  /** 自定义容器,会执行多次 为 false 时表示不适用 portal */
  container?: GetContainerType

  visible?: boolean

  forceRender?: boolean
}

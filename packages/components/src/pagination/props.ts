import type { CSSProperties, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react'

export interface PaginationProps {
  className?: string
  /**
   * @desc_zh  当前页
   */
  current?: number
  /**
   * @desc_zh 默认当前页
   * @default  1
   */
  defaultCurrent?: number
  /**
   * @desc_zh 默认每页条数
   * @default 10
   */
  defaultPageSize?: number
  /**
   * @desc_zh 禁用分页
   */
  disabled?: boolean

  /**
   * @desc_zh 只有一页时隐藏分页器
   * @default false
   */
  hideOnSinglePage?: boolean

  /**
   * @desc_zh 自定义页码的结构
   */
  itemRender?: ItemRenderHandler
  /**
   * @desc_zh 页码或者`pageSize`改变后的回调
   */
  onChange?: (page: number, pageSize: number) => void
  /**
   * @desc_zh `pageSize`改变后的回调
   */
  onSizeChange?: (current: number, next: number) => void
  /**
   * @desc_zh 每页条数
   */
  pageSize?: number
  /**
   * @desc_zh 页码按钮的数量，当总页数超过该值时会折叠
   * @desc_en 页码按钮的数量，当总页数超过该值时会折叠
   * @validator `(value:number) => value >= 5 & value <= 21 & value % 2 === 1`
   * @default 7
   */
  pagerCount?: number
  /**
   * @desc_zh 当size未指定时，自动根据屏幕尺寸调整size
   */
  responsive?: boolean

  /**
   * @desc_zh 是否显示原生 title 提示
   * @default true
   */
  showHtmlTitle?: boolean
  /**
   * @desc_zh 是否可以跳转至某页
   * @default false
   */
  showJumper?: boolean

  /**
   * @desc_zh 是否展示`pageSize`切换器，当`total`大于50时默认为true
   */
  showSizeChanger?: boolean

  /**
   * @desc_zh 简洁模式
   */
  simple?: boolean
  /**
   * @desc_zh 尺寸大小
   */
  size?: 'default' | 'small'
  /**
   * @desc_zh 指定每页可以显示多少条
   * @default [10, 20, 50, 100]
   */
  sizeOptions?: number[]

  style?: CSSProperties
  /**
   * @desc_zh 数据总数
   * @default 0
   */
  total?: number
  /**
   * @desc_zh `total`大于多少时自动显示`sizeChanger`
   */
  totalBoundaryShowSizeChanger?: number
  /**
   * @desc_zh 自定义显示总数
   */
  totalRender?: TotalRenderHandler
}

export type ItemRenderHandler = (
  page: number,
  type: 'next' | 'page' | 'prev',
  element: ReactNode,
) => ReactNode

export type TotalRenderHandler = (total: number, range: [number, number]) => ReactNode

export interface PagerProps {
  active: boolean
  className?: string
  disabled: boolean
  itemRender: ItemRenderHandler
  name: string
  onClick: MouseEventHandler
  onKeyPress: KeyboardEventHandler
  page: number
  prefix: string
  showHtmlTitle: boolean
}

/**
 * |-----------------------------------|
 * |-----------------------------------|
 * |           default props           |
 * |-----------------------------------|
 * |-----------------------------------|
 */

export const defaultPaginationProps: Partial<PaginationProps> = {
  defaultCurrent: 1,
  defaultPageSize: 10,
  hideOnSinglePage: false,
  showHtmlTitle: true,
  showJumper: false,
  simple: false,
  total: 0,
  totalBoundaryShowSizeChanger: 50,
}

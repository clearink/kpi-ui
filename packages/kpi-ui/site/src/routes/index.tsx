/* eslint-disable import/no-extraneous-dependencies */
import loadable from '@loadable/component'
import { ComponentType, ReactNode } from 'react'
import NotFound from '../components/404'
import { withLazyloadDocument } from '../components/hocs'

export interface RouteExtraProps {
  routes?: RouteItem[]
  children?: ReactNode
}
export interface RouteItem {
  path: string
  title?: string
  component: ComponentType<RouteExtraProps>
  children?: RouteItem[]
}
export default [
  {
    // 首页
    path: '/',
    component: loadable(() => import('../pages/home')),
  },
  {
    path: '/components',
    component: loadable(() => import('../pages/document')),
    children: [
      {
        path: 'button',
        title: '按钮',
        component: withLazyloadDocument(() => import('../../../src/button/index.zh-CN.md')),
      },
      {
        path: 'divider',
        title: '分割线',
        component: withLazyloadDocument(() => import('../../../src/divider/index.zh-CN.md')),
      },
      {
        path: 'form',
        title: '表单',
        component: withLazyloadDocument(() => import('../../../src/form/index.zh-CN.md')),
      },
    ],
  },
  {
    path: '*',
    // 404
    component: NotFound,
  },
] as RouteItem[]

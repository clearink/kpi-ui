/* eslint-disable import/no-extraneous-dependencies */
import cls from 'classnames'
import { NavLink } from 'react-router-dom'
import DocumentMenuItem from '../menu_item'

import styles from './style.module.scss'

import type { DocumentMenuProps } from './interface'

export default function DocumentMenu(props: DocumentMenuProps) {
  const { routes = [], className } = props
  return (
    <div className={cls(styles['document-menu'], className)}>
      {routes.map((route) => {
        return (
          <DocumentMenuItem key={route.path}>
            <NavLink to={route.path}>{route.title || route.path}</NavLink>
          </DocumentMenuItem>
        )
      })}
    </div>
  )
}

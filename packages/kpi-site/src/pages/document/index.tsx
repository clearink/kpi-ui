/* eslint-disable import/no-extraneous-dependencies */
import { Outlet } from 'react-router-dom'
import DocumentMenu from './components/menu'

import styles from './style.module.scss'

import type { DocumentProps } from './interface'
import DocumentAnchor from './components/anchor'

export default function Document(props: DocumentProps) {
  return (
    <div className={styles['app-document']}>
      <aside className={styles['app-document__menu']}>
        <DocumentMenu routes={props.routes} />
      </aside>
      <main className={styles['app-document__content']}>
        <Outlet />
      </main>
      <aside className={styles['app-document__anchor']}>
        <DocumentAnchor />
      </aside>
    </div>
  )
}

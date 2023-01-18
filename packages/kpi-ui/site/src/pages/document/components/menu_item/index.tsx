import styles from './style.module.scss'

import type { DocumentMenuItemProps } from './interface'

export default function DocumentMenuItem(props: DocumentMenuItemProps) {
  const { children } = props
  return <div className={styles['menu-item']}>{children}</div>
}
